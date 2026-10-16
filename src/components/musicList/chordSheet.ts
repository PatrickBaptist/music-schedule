const CHROMATIC_SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const CHROMATIC_FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const PITCHES: Record<string, number> = {
  C: 0, "B#": 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, Fb: 4,
  "E#": 5, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9,
  "A#": 10, Bb: 10, B: 11, Cb: 11,
};

const chordToken = /^([A-G](?:#|b)?)(.*)$/;
const tokenIsChord = (token: string) => {
  const match = token.match(chordToken);
  if (!match || !Object.prototype.hasOwnProperty.call(PITCHES, match[1])) return false;
  const suffix = match[2];
  return !suffix || /^(?:maj|min|m|M|dim|aug|sus|add|\d|\(|\/|\+|-|°|ø|alt|b|#)/i.test(suffix);
};

export const normalizeKey = (key: string) => key.trim().replace("♯", "#").replace("♭", "b");

export const transposeChord = (chord: string, semitones: number, preferFlats = false): string => {
  const wrapped = chord.match(/^([([])(.*)([)\]])$/);
  const prefix = wrapped?.[1] || "";
  const suffix = wrapped?.[3] || "";
  const body = wrapped?.[2] || chord;
  const parts = body.split("/");
  const transposeNote = (part: string) => {
    const match = part.match(chordToken);
    if (!match || PITCHES[match[1]] === undefined) return part;
    const root = match[1];
    const chromatic = preferFlats || root.includes("b") ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
    const note = chromatic[((PITCHES[root] + semitones) % 12 + 12) % 12];
    return `${note}${match[2]}`;
  };
  return `${prefix}${parts.map(transposeNote).join("/")}${suffix}`;
};

const isTabLine = (line: string) => /^\s*[eBGDAE]\|/.test(line) || /^\s*(?:Tab|Solo\s+Tab)\b/i.test(line);
const isSectionLine = (line: string) => /^\s*\[[^\]]+\]\s*$/.test(line);
const isChordLine = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed || isTabLine(line) || isSectionLine(line)) return false;
  const tokens = trimmed
    .split(/\s+/)
    .map((token) => token.replace(/^[([{]+|[)\]}]+$/g, ""))
    .filter(Boolean);
  return tokens.length > 0 && tokens.every(tokenIsChord);
};

export type ChordSheetLine = { type: "chords" | "lyrics" | "section" | "tab"; value: string };

export const transposeChordSheet = (text: string, semitones: number): ChordSheetLine[] =>
  text.replace(/\r\n?/g, "\n").split("\n").map((line) => {
    if (isTabLine(line)) return { type: "tab", value: line };
    if (isSectionLine(line)) return { type: "section", value: line };
    if (isChordLine(line)) {
      const value = line.replace(/\S+/g, (token) => {
        const opening = token.match(/^[([{]+/)?.[0] || "";
        const closing = token.match(/[)\]}]+$/)?.[0] || "";
        const chord = token.slice(opening.length, closing ? -closing.length : undefined);
        return tokenIsChord(chord) ? `${opening}${transposeChord(chord, semitones)}${closing}` : token;
      });
      return { type: "chords", value };
    }
    return { type: "lyrics", value: line };
  });

export const getTransposeDistance = (sourceKey: string, targetKey: string) => {
  const sourceName = normalizeKey(sourceKey).replace(/m$/i, "");
  const targetName = normalizeKey(targetKey).replace(/m$/i, "");
  const source = PITCHES[sourceName];
  const target = PITCHES[targetName];
  if (source === undefined || target === undefined) return 0;
  return (target - source + 12) % 12;
};

export const transposeKeyBy = (key: string, semitones: number) => {
  const normalized = normalizeKey(key);
  const isMinor = /m$/i.test(normalized);
  const root = normalized.replace(/m$/i, "");
  const pitch = PITCHES[root];
  if (pitch === undefined) return key;
  const next = CHROMATIC_SHARPS[((pitch + semitones) % 12 + 12) % 12];
  return `${next}${isMinor ? "m" : ""}`;
};
