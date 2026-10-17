"use client";

import { shouldInitiate, type RoomSignal, type SignalKind } from "./protocol";

/**
 * 방 안 사람끼리 음성을 직접 잇는다(WebRTC 메시, 음성만).
 *
 * 서버 없이 사람끼리 바로 잇기 때문에 비용이 없지만, 일부 모바일 망(대칭
 * NAT)에서는 중계 서버(TURN) 없이 연결이 안 될 수 있다 — 시험에서 확인할 것.
 *
 * 모든 연결에 음성 자리(transceiver)를 하나 두고 보내기·받기로 연다. 듣기만
 * 하는 사람도 자리는 있어서, 나중에 말하기 자리로 올라갈 때 다시 협상하지 않고
 * 트랙만 끼운다(replaceTrack).
 */
const ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

export type PeerState = "connecting" | "connected" | "failed";

type Peer = {
  pc: RTCPeerConnection;
  audio: HTMLAudioElement;
  pendingIce: RTCIceCandidateInit[];
  remoteSet: boolean;
  /** 상대 소리 크기를 재는 것(자리 격자의 "말하는 중" 테두리). */
  meter: { source: MediaStreamAudioSourceNode; analyser: AnalyserNode; speaking: boolean } | null;
};

/** 이보다 크면 말하는 중으로 본다. 내 마이크 쪽(speech.ts)과 비슷한 값. */
const SPEAKING_RMS = 0.02;

export class RoomMesh {
  private peers = new Map<string, Peer>();
  private localTrack: MediaStreamTrack | null = null;
  private closed = false;
  private ctx: AudioContext | null = null;
  private meterTimer = 0;
  private samples = new Float32Array(512);

  constructor(
    private readonly selfId: string,
    private readonly send: (to: string, kind: SignalKind, data: string) => void,
    private readonly onState: (peerId: string, state: PeerState | null) => void,
    private readonly onSpeaking?: (peerId: string, speaking: boolean) => void,
  ) {}

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
      const sender = this.audioTransceiver(peer.pc)?.sender;
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
        const transceiver = this.audioTransceiver(peer.pc);
        if (transceiver) {
          transceiver.direction = "sendrecv";
          await transceiver.sender.replaceTrack(this.localTrack);
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
    const offer = await peer.pc.createOffer();
    await peer.pc.setLocalDescription(offer);
    this.send(peerId, "offer", JSON.stringify(peer.pc.localDescription));
  }

  private create(peerId: string): Peer {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audio.setAttribute("playsinline", "");
    audio.dataset.roomPeer = peerId;
    audio.style.display = "none";
    document.body.appendChild(audio);
    const peer: Peer = { pc, audio, pendingIce: [], remoteSet: false, meter: null };
    this.peers.set(peerId, peer);
    this.onState(peerId, "connecting");

    pc.onicecandidate = (event) => {
      if (event.candidate) this.send(peerId, "ice", JSON.stringify(event.candidate.toJSON()));
    };
    pc.ontrack = (event) => {
      const stream = event.streams[0] ?? new MediaStream([event.track]);
      audio.srcObject = stream;
      void audio.play().catch(() => {});
      this.watch(peerId, peer, stream);
    };
    pc.onconnectionstatechange = () => {
      if (this.peers.get(peerId)?.pc !== pc) return;
      const state = pc.connectionState;
      if (state === "connected") this.onState(peerId, "connected");
      else if (state === "failed") this.onState(peerId, "failed");
    };
    return peer;
  }

  private audioTransceiver(pc: RTCPeerConnection): RTCRtpTransceiver | undefined {
    // 연결마다 음성 자리는 하나뿐이다(offer가 하나만 연다).
    return pc.getTransceivers()[0];
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
    peer.pc.close();
    peer.meter?.source.disconnect();
    if (peer.meter?.speaking) this.onSpeaking?.(peerId, false);
    peer.audio.srcObject = null;
    peer.audio.remove();
    this.onState(peerId, null);
  }
}
