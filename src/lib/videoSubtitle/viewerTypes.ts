/** How firmly a piece of context is known — speculation must not enter captions. */
export type EvidenceLevel =
  | "explicit"
  | "established"
  | "strongly_implied"
  | "speculative";

export type ResolvedReference = {
  expression: string;
  refersTo: string;
  evidenceLevel: EvidenceLevel;
  confidence?: number;
};

/** English-native understanding of one utterance — no Korean yet. */
export type NativeInterpretation = {
  unitId: string;
  understoodMeaning: string;
  references: ResolvedReference[];
  intent?: string;
  tone?: string;
  confidence?: number;
  /** Short note for learning UI: why a reference was resolved this way. */
  establishedNote?: string;
};

export type ViewerCharacter = {
  label: string;
  notes: string[];
};

export type ViewerEntity = {
  name: string;
  description: string;
  relatedTo?: string;
  evidenceLevel: EvidenceLevel;
};

/**
 * Accumulated memory of a native viewer watching from the start.
 * Not a full transcript dump — only meaning-bearing state.
 */
export type ViewerContext = {
  storySoFar: string;
  currentSituation: string;
  characters: ViewerCharacter[];
  entities: ViewerEntity[];
  establishedFacts: string[];
  ongoingTopics: string[];
  conversationState: string;
  recentEvents: string[];
};

export function emptyViewerContext(seed?: {
  topic?: string;
  summary?: string;
}): ViewerContext {
  return {
    storySoFar: seed?.summary?.slice(0, 400) || seed?.topic || "",
    currentSituation: seed?.summary?.slice(0, 200) || "",
    characters: [],
    entities: [],
    establishedFacts: [],
    ongoingTopics: seed?.topic ? [seed.topic] : [],
    conversationState: "",
    recentEvents: [],
  };
}

export function compactViewerContext(
  context: ViewerContext,
): ViewerContext {
  return {
    storySoFar: context.storySoFar.slice(0, 500),
    currentSituation: context.currentSituation.slice(0, 280),
    characters: context.characters.slice(0, 8).map((row) => ({
      label: row.label.slice(0, 40),
      notes: row.notes.slice(0, 4).map((note) => note.slice(0, 120)),
    })),
    entities: context.entities.slice(0, 10).map((row) => ({
      name: row.name.slice(0, 40),
      description: row.description.slice(0, 160),
      relatedTo: row.relatedTo?.slice(0, 40),
      evidenceLevel: row.evidenceLevel,
    })),
    establishedFacts: context.establishedFacts.slice(-12).map((f) => f.slice(0, 160)),
    ongoingTopics: context.ongoingTopics.slice(0, 6).map((t) => t.slice(0, 80)),
    conversationState: context.conversationState.slice(0, 200),
    recentEvents: context.recentEvents.slice(-8).map((e) => e.slice(0, 120)),
  };
}
