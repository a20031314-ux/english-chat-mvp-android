export type SceneContext = {
  id: string;
  startTime: number;
  endTime: number;
  setting?: string;
  situation?: string;
  interaction?: string;
  mood?: string;
  visualCues?: string[];
  confidence?: number;
  /** Soft flag for future selective vision. */
  visualContextNeeded?: boolean;
};

export type ConversationContext = {
  topic: string;
  situation?: string;
  participants?: string[];
  recentMeaning?: string;
};

export type VisualSceneSpan = {
  id: string;
  startTime: number;
  endTime: number;
};

export type RepresentativeFrame = {
  sceneId: string;
  timeSeconds: number;
  /** JPEG bytes for vision; omitted when extraction failed. */
  jpeg?: Buffer;
  mimeType?: string;
};
