"use client";

import { shouldInitiate, type RoomSignal, type SignalKind } from "./protocol";

/**
 * 방 안 사람끼리 음성(영상 방이면 영상도)을 직접 잇는다(WebRTC 메시).
 *
 * 서버 없이 사람끼리 바로 잇기 때문에 비용이 없지만, 일부 모바일 망(대칭
 * NAT)에서는 중계 서버(TURN) 없이 연결이 안 될 수 있다 — 시험에서 확인할 것.
 *
 * 모든 연결에 음성 자리(transceiver)를 하나 두고 보내기·받기로 연다. 듣기만
 * 하는 사람도 자리는 있어서, 나중에 말하기 자리로 올라갈 때 다시 협상하지 않고
 * 트랙만 끼운다(replaceTrack).
 *
 * 영상 방(1:1·러닝메이트 통화, RoomMeta.video)은 영상 자리도 처음부터 하나 연다. 카메라를
 * 켜고 끌 때도 다시 협상하지 않고 트랙만 끼우거나 빼고, 켬/끔은 "cam" 신호로 알린다
 * (빈 영상 자리는 화면만 검게 남아서, 상대가 얼굴 대신 사진을 띄우려면 알려 줘야 한다).
 * 비공개 통화 방은 서버가 중계(TURN) 주소를 같이 준다(setIceServers, lib/server/turn.ts).
 *
 * 연결마다 글 통로(데이터 채널) 하나도 연다: 받아쓴 자막 줄을 서버에 올린 뒤 바로 사람들에게도 보내,
 * 1.5초마다 묻는 서버 확인을 기다리지 않고 뜨게 한다(broadcast). 서버 기록이 원본이고 이건 빨리 보이게 하는 것뿐 —
 * 예전 앱과 이어진 연결은 통로가 안 열려서 지금처럼 서버 확인으로 받는다.
 */
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

/** 영상 한 갈래의 상한. 1:1이라 넉넉하지만, 모바일 데이터에서 30분 약 100MB 안쪽. */
export const VIDEO_MAX_BITRATE = 450_000;

export type PeerState = "connecting" | "connected" | "failed";

type Peer = {
  pc: RTCPeerConnection;
  audio: HTMLAudioElement;
  /** 상대 영상(영상 방에서 상대가 카메라를 켰을 때). */
  video: MediaStream | null;
  /** 상대가 알려 온 카메라 켬/끔. */
  camOn: boolean;
  pendingIce: RTCIceCandidateInit[];
  remoteSet: boolean;
  /** 상대 소리 크기를 재는 것(자리 격자의 "말하는 중" 테두리). */
  meter: { source: MediaStreamAudioSourceNode; analyser: AnalyserNode; speaking: boolean } | null;
  /** 글 통로(자막 줄을 바로 보냄). 못 열면 null. */
  channel: RTCDataChannel | null;
};

/** 양쪽이 같은 번호로 미리 만드는 글 통로(협상 없이 열림). 예전 앱은 이 통로가 없어 그냥 안 열린다. */
const LINE_CHANNEL_ID = 7;
/** 통로로 받는 글 하나의 상한(자막 줄 하나면 충분). */
const MAX_CHANNEL_MESSAGE = 4_000;

/** 이보다 크면 말하는 중으로 본다. 내 마이크 쪽(speech.ts)과 비슷한 값. */
const SPEAKING_RMS = 0.02;

export class RoomMesh {
  private peers = new Map<string, Peer>();
  private localTrack: MediaStreamTrack | null = null;
  private localVideo: MediaStreamTrack | null = null;
  private iceServers: RTCIceServer[] = DEFAULT_ICE_SERVERS;
  private closed = false;
  private ctx: AudioContext | null = null;
  private meterTimer = 0;
  private samples = new Float32Array(512);
  private onMessage: ((peerId: string, data: string) => void) | null = null;

  constructor(
    private readonly selfId: string,
    private readonly send: (to: string, kind: SignalKind, data: string) => void,
    private readonly onState: (peerId: string, state: PeerState | null) => void,
    private readonly onSpeaking?: (peerId: string, speaking: boolean) => void,
    /** 영상 방이면 영상 자리를 열고, 상대 영상·카메라 켬/끔을 알린다. */
    private readonly video?: { onVideo: (peerId: string, stream: MediaStream | null, camOn: boolean) => void },
  ) {}

  /** 글 통로로 온 것을 받을 곳(자막 줄). */
  setMessageHandler(handler: (peerId: string, data: string) => void): void {
    this.onMessage = handler;
  }

  /** 열린 글 통로 모두에 보낸다. 못 보낸 사람은 서버 확인으로 받는다. */
  broadcast(data: string): void {
    for (const peer of this.peers.values()) {
      if (peer.channel?.readyState !== "open") continue;
      try {
        peer.channel.send(data);
      } catch {
        // 막 닫힌 통로 — 서버 기록으로 받는다.
      }
    }
  }

  /** 비공개 통화 방: 서버가 준 중계 주소. 새로 잇는 연결부터 쓴다. */
  setIceServers(servers: RTCIceServer[]): void {
    if (servers.length) this.iceServers = servers;
  }

  /** 영상 방에서 내 카메라 트랙(끄면 null). 모든 연결에 바로 끼우고 켬/끔을 알린다. */
  setLocalVideo(track: MediaStreamTrack | null): void {
    if (!this.video) return;
    this.localVideo = track;
    for (const [id, peer] of this.peers) {
      const sender = this.transceiver(peer.pc, "video")?.sender;
      if (sender) void sender.replaceTrack(track).then(() => capBitrate(sender)).catch(() => {});
      this.send(id, "cam", track ? "on" : "off");
    }
  }

  private emitVideo(peerId: string, peer: Peer): void {
    this.video?.onVideo(peerId, peer.camOn ? peer.video : null, peer.camOn);
  }

  private watch(peerId: string, peer: Peer, stream: MediaStream): void {
    if (!this.onSpeaking || peer.meter) return;
    try {
      this.ctx ??= new AudioContext();
      const source = this.ctx.createMediaStreamSource(stream);
      const analyser = this.ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      peer.meter = { source, analyser, speaking: false };
    } catch {
      return;
    }
    if (this.meterTimer) return;
    this.meterTimer = window.setInterval(() => {
      if (this.ctx?.state === "suspended") void this.ctx.resume().catch(() => {});
      for (const [id, row] of this.peers) {
        if (!row.meter) continue;
        row.meter.analyser.getFloatTimeDomainData(this.samples);
        let sum = 0;
        for (const value of this.samples) sum += value * value;
        const speaking = Math.sqrt(sum / this.samples.length) > SPEAKING_RMS;
        if (speaking !== row.meter.speaking) {
          row.meter.speaking = speaking;
          this.onSpeaking?.(id, speaking);
        }
      }
    }, 150);
  }

  /** 말하기 자리면 내 마이크 트랙, 듣기만이면 null. 모든 연결에 바로 반영. */
  setLocalTrack(track: MediaStreamTrack | null): void {
    this.localTrack = track;
    for (const peer of this.peers.values()) {
      const sender = this.transceiver(peer.pc, "audio")?.sender;
      void sender?.replaceTrack(track).catch(() => {});
    }
  }

  /** 지금 방에 있는 사람들. 새로 온 사람은 잇고, 나간 사람은 끊는다. */
  sync(memberIds: string[]): void {
    if (this.closed) return;
    const wanted = new Set(memberIds.filter((id) => id !== this.selfId));
    for (const id of [...this.peers.keys()]) {
      if (!wanted.has(id)) this.drop(id);
    }
    for (const id of wanted) {
      const existing = this.peers.get(id);
      if (existing && existing.pc.connectionState === "failed") this.drop(id);
      if (!this.peers.has(id) && shouldInitiate(this.selfId, id)) void this.offer(id);
    }
  }

  async handle(signal: RoomSignal): Promise<void> {
    if (this.closed || signal.to !== this.selfId) return;
    try {
      if (signal.kind === "offer") {
        // 상대가 새로 청하면 예전 연결은 버린다(상대가 다시 들어온 경우).
        if (this.peers.has(signal.from)) this.drop(signal.from, false);
        const peer = this.create(signal.from);
        await peer.pc.setRemoteDescription(JSON.parse(signal.data) as RTCSessionDescriptionInit);
        peer.remoteSet = true;
        const transceiver = this.transceiver(peer.pc, "audio");
        if (transceiver) {
          transceiver.direction = "sendrecv";
          await transceiver.sender.replaceTrack(this.localTrack);
        }
        // 영상 자리는 상대 offer에 있을 때만(예전 앱은 음성만 연다 — 그러면 영상 없이 소리만).
        const videoSlot = this.video ? this.transceiver(peer.pc, "video") : undefined;
        if (videoSlot) {
          videoSlot.direction = "sendrecv";
          await videoSlot.sender.replaceTrack(this.localVideo);
          await capBitrate(videoSlot.sender);
        }
        await this.flushIce(peer);
        const answer = await peer.pc.createAnswer();
        await peer.pc.setLocalDescription(answer);
        this.send(signal.from, "answer", JSON.stringify(peer.pc.localDescription));
      } else if (signal.kind === "answer") {
        const peer = this.peers.get(signal.from);
        if (!peer || peer.pc.signalingState !== "have-local-offer") return;
        await peer.pc.setRemoteDescription(JSON.parse(signal.data) as RTCSessionDescriptionInit);
        peer.remoteSet = true;
        await this.flushIce(peer);
      } else if (signal.kind === "ice") {
        const peer = this.peers.get(signal.from);
        if (!peer) return;
        const candidate = JSON.parse(signal.data) as RTCIceCandidateInit;
        if (peer.remoteSet) await peer.pc.addIceCandidate(candidate).catch(() => {});
        else peer.pendingIce.push(candidate);
      } else if (signal.kind === "bye") {
        this.drop(signal.from, false);
      } else if (signal.kind === "cam") {
        const peer = this.peers.get(signal.from);
        if (!peer || !this.video) return;
        peer.camOn = signal.data === "on";
        this.emitVideo(signal.from, peer);
      }
    } catch (error) {
      console.warn("[rooms] signal failed", signal.kind, error);
    }
  }

  close(): void {
    this.closed = true;
    for (const id of [...this.peers.keys()]) this.drop(id);
    window.clearInterval(this.meterTimer);
    void this.ctx?.close().catch(() => {});
  }

  private async offer(peerId: string): Promise<void> {
    const peer = this.create(peerId);
    const transceiver = peer.pc.addTransceiver("audio", { direction: "sendrecv" });
    await transceiver.sender.replaceTrack(this.localTrack).catch(() => {});
    if (this.video) {
      const videoSlot = peer.pc.addTransceiver("video", { direction: "sendrecv" });
      await videoSlot.sender.replaceTrack(this.localVideo).catch(() => {});
      await capBitrate(videoSlot.sender);
    }
    const offer = await peer.pc.createOffer();
    await peer.pc.setLocalDescription(offer);
    this.send(peerId, "offer", JSON.stringify(peer.pc.localDescription));
  }

  private create(peerId: string): Peer {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audio.setAttribute("playsinline", "");
    audio.dataset.roomPeer = peerId;
    audio.style.display = "none";
    document.body.appendChild(audio);
    let channel: RTCDataChannel | null = null;
    try {
      channel = pc.createDataChannel("lines", { negotiated: true, id: LINE_CHANNEL_ID, ordered: true });
      channel.onmessage = (event) => {
        if (typeof event.data === "string" && event.data.length <= MAX_CHANNEL_MESSAGE) this.onMessage?.(peerId, event.data);
      };
    } catch {
      channel = null;
    }
    const peer: Peer = { pc, audio, video: null, camOn: false, pendingIce: [], remoteSet: false, meter: null, channel };
    this.peers.set(peerId, peer);
    this.onState(peerId, "connecting");

    pc.onicecandidate = (event) => {
      if (event.candidate) this.send(peerId, "ice", JSON.stringify(event.candidate.toJSON()));
    };
    pc.ontrack = (event) => {
      if (event.track.kind === "video") {
        peer.video = new MediaStream([event.track]);
        this.emitVideo(peerId, peer);
        return;
      }
      const stream = new MediaStream([event.track]);
      audio.srcObject = stream;
      void audio.play().catch(() => {});
      this.watch(peerId, peer, stream);
    };
    pc.onconnectionstatechange = () => {
      if (this.peers.get(peerId)?.pc !== pc) return;
      const state = pc.connectionState;
      if (state === "connected") {
        this.onState(peerId, "connected");
        // 이어진 뒤 내 카메라 상태를 한 번 알린다(먼저 켜 둔 채 상대가 들어온 경우).
        if (this.video) this.send(peerId, "cam", this.localVideo ? "on" : "off");
      }
      else if (state === "failed") this.onState(peerId, "failed");
    };
    return peer;
  }

  private transceiver(pc: RTCPeerConnection, kind: "audio" | "video"): RTCRtpTransceiver | undefined {
    // 연결마다 음성 자리 하나, 영상 방이면 영상 자리 하나(offer가 연 순서대로).
    return pc.getTransceivers().find((row) => row.receiver.track?.kind === kind);
  }

  private async flushIce(peer: Peer): Promise<void> {
    const pending = peer.pendingIce.splice(0);
    for (const candidate of pending) await peer.pc.addIceCandidate(candidate).catch(() => {});
  }

  private drop(peerId: string, sayBye = true): void {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    this.peers.delete(peerId);
    if (sayBye && !this.closed) this.send(peerId, "bye", "");
    try {
      peer.channel?.close();
    } catch {
      // 이미 닫힘.
    }
    peer.pc.close();
    peer.meter?.source.disconnect();
    if (peer.meter?.speaking) this.onSpeaking?.(peerId, false);
    peer.audio.srcObject = null;
    peer.audio.remove();
    if (this.video && (peer.video || peer.camOn)) this.video.onVideo(peerId, null, false);
    this.onState(peerId, null);
  }
}

/** 영상 한 갈래의 비트레이트 상한(모바일 데이터·발열). 못 하면 브라우저 기본값. */
async function capBitrate(sender: RTCRtpSender): Promise<void> {
  if (!sender.track || sender.track.kind !== "video") return;
  try {
    const params = sender.getParameters();
    if (!params.encodings?.length) params.encodings = [{}];
    if (params.encodings[0].maxBitrate === VIDEO_MAX_BITRATE) return;
    params.encodings[0].maxBitrate = VIDEO_MAX_BITRATE;
    await sender.setParameters(params);
  } catch {
    // 일부 브라우저는 협상 전에 막는다 — 다음 replaceTrack 때 다시.
  }
}
