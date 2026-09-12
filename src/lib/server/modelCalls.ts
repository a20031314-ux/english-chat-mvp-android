/**
 * What each metered route costs in model calls, and the names of the routes
 * that are metered at all.
 *
 * Split out from meterRequest so that a script can read it. The metering
 * function reaches for request objects and the entitlement store through the
 * "@/" alias, which Node cannot resolve when a file under scripts/ is run
 * directly — and a reporting script that hardcoded its own copy of these
 * multipliers would be wrong the first time a route changed shape.
 *
 * Nothing here imports anything, deliberately.
 */

/**
 * Roughly how many model calls one request of each kind sets off, so the counts
 * can be read as spending rather than as clicks.
 *
 * A sentence analysis is the outlier: an overview call plus one per dimension
 * the language profile declares active, which is three or four. The rest ask
 * the model once. Keep these honest when a route's shape changes — they are the
 * multiplier anyone will reach for when turning counts into cost.
 */
export const MODEL_CALLS_PER_REQUEST = {
  analysisInput: 5,
  analysisElement: 1,
  expressionInsight: 1,
  vocabGloss: 1,
  learningSpans: 1,
  translate: 1,
  tts: 1,
  // The video routes, which were the remaining gap. An import point is charged
  // once when a video is prepared, and then every twenty seconds of watching is
  // its own window costing three passes — so the charge lands on the small half
  // and the rest went by uncounted. Counting it does not charge for it; it makes
  // the shape of the spending visible before anyone prices against it.
  videoPrepare: 3,
  videoWindow: 3,
  videoGloss: 1,
  videoAnalyze: 1,
  // The roleplay's only model call. Its tutor speaks from files, so a scripted
  // scene costs one transcription per learner turn and nothing else — which is
  // the claim the whole mode rests on, and therefore the one worth counting.
  roleplayListen: 1,
  // A correction the scenario did not have written. Rarer than listening by
  // design — most misses at a turn are the same miss and were recorded — so a
  // count that climbs towards the listen count means the scripts are missing
  // the trouble they were supposed to anticipate.
  roleplayCorrect: 1,
  // The director: a turn the script could not take. What the watching tutor
  // costs is this count, plus a tts for each line it wrote rather than picked
  // from the recordings — so its ratio to roleplayListen is how much of the
  // conversation the script is actually carrying.
  roleplayTurn: 1,
  // Folding lines the tutor no longer reads verbatim into its notes. Once per
  // ten lines past the thirtieth, so only long conversations make any.
  roleplayContext: 1,
} as const;

export type MeteredOp = keyof typeof MODEL_CALLS_PER_REQUEST;
