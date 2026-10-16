import React from "react";
import { createPortal } from "react-dom";
import { FaMinus, FaPlus, FaTimes, FaWindowMinimize } from "react-icons/fa";
import { MusicLink } from "../../services/MusicLinksService";
import { getTransposeDistance, transposeChordSheet, transposeKeyBy } from "./chordSheet";

type Props = {
  music: MusicLink;
  selectedKey: string;
  onKeyChange: (key: string) => void;
  onMinimize: () => void;
  onClose: () => void;
};

export type MinimizedChordSheet = { music: MusicLink; selectedKey: string };

type MinimizedListProps = {
  items: MinimizedChordSheet[];
  onRestore: (item: MinimizedChordSheet) => void;
  onClose: (id: string) => void;
};

const KEYS = ["C", "Cm", "C#", "C#m", "Db", "Dbm", "D", "Dm", "D#", "D#m", "Eb", "Ebm", "E", "Em", "F", "Fm", "F#", "F#m", "Gb", "Gbm", "G", "Gm", "G#", "G#m", "Ab", "Abm", "A", "Am", "A#", "A#m", "Bb", "Bbm", "B", "Bm"];

const Button = ({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) => (
  <button type="button" aria-label={label} title={label} onClick={onClick}>{children}</button>
);

const ChordSheetReader: React.FC<Props> = ({ music, selectedKey, onKeyChange, onMinimize, onClose }) => {
  if (!music.lyricsChords?.trim()) return null;
  const sourceKey = music.chordSourceKey || music.cifra || "C";
  const semitones = getTransposeDistance(sourceKey, selectedKey);
  const lines = transposeChordSheet(music.lyricsChords, semitones);
  const setSemitones = (amount: number) => onKeyChange(transposeKeyBy(selectedKey, amount));

  const styles = `
    .chord-reader-overlay { position: fixed; inset: 0; z-index: 12000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(5, 12, 22, .76); }
    .chord-reader { width: min(920px, 100%); max-height: min(90vh, 900px); display:flex; flex-direction:column; color:var(--color-text-strong,#f6f7fb); background:var(--color-surface,#111827); border:1px solid var(--color-border,#344054); border-radius:18px; box-shadow:0 24px 80px #0008; overflow:hidden; }
    .chord-reader header { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-bottom:1px solid var(--color-border,#344054); }
    .chord-reader header h2 { margin:0; font-size:1.1rem; }
    .chord-reader-actions,.chord-reader-controls { display:flex; align-items:center; gap:8px; }
    .chord-reader button { min-height:42px; border:1px solid var(--color-border,#475467); border-radius:10px; padding:8px 12px; color:inherit; background:var(--color-surface-muted,#1f2937); font:inherit; cursor:pointer; }
    .chord-reader-actions button { width:38px; height:38px; min-height:38px; flex:0 0 38px; display:inline-flex; align-items:center; justify-content:center; padding:0; border-radius:50%; }
    .chord-reader button:hover { border-color:var(--color-primary,#3b82f6); }
    .chord-reader-controls { flex-wrap:wrap; padding:12px 18px; border-bottom:1px solid var(--color-border,#344054); }
    .chord-reader-controls strong { margin-right:auto; }
    .chord-reader-controls .key-label { display:flex; align-items:center; gap:8px; }
    .chord-reader-controls select { min-height:40px; padding:6px 10px; border:1px solid var(--color-border,#475467); border-radius:9px; color:inherit; background:var(--color-surface-muted,#1f2937); font:inherit; }
    .chord-reader-body { overflow:auto; padding:20px clamp(16px,4vw,40px) 32px; }
    .chord-reader-line { min-height:1.5em; white-space:pre-wrap; overflow-wrap:anywhere; }
    .chord-reader-line.chords { color:var(--color-primary,#60a5fa); font-weight:750; font-family:ui-monospace,SFMono-Regular,Consolas,monospace; }
    .chord-reader-line.section { margin-top:20px; color:var(--color-text-muted,#98a2b3); font-weight:700; }
    .chord-reader-line.tab { overflow-x:auto; color:var(--color-text-muted,#98a2b3); font-family:ui-monospace,SFMono-Regular,Consolas,monospace; }
    @media(max-width:540px) { .chord-reader-overlay { padding:8px; } .chord-reader { max-height:calc(100vh - 100px); } .chord-reader header,.chord-reader-controls { padding:10px; } .chord-reader-controls strong { width:100%; } .chord-reader-controls .key-label { margin-right:auto; } }
  `;

  return createPortal(<><style>{styles}</style><div className="chord-reader-overlay" onMouseDown={(event) => event.target === event.currentTarget && onMinimize()}>
    <section className="chord-reader" role="dialog" aria-modal="true" aria-labelledby="chord-reader-title">
      <header><h2 id="chord-reader-title">{music.name}</h2><div className="chord-reader-actions">
        <Button label="Minimizar cifra" onClick={onMinimize}><FaWindowMinimize /></Button>
        <Button label="Fechar cifra" onClick={onClose}><FaTimes /></Button>
      </div></header>
      <div className="chord-reader-controls"><strong>Tom atual: {selectedKey}</strong>
        <button type="button" onClick={() => setSemitones(-1)}><FaMinus aria-hidden="true" /> Descer tom</button>
        <button type="button" onClick={() => setSemitones(1)}><FaPlus aria-hidden="true" /> Subir tom</button>
        <label className="key-label">Escolher tom<select value={selectedKey} onChange={(event) => onKeyChange(event.target.value)}>{KEYS.map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
      </div>
      <div className="chord-reader-body">{lines.map((line, index) => <div key={index} className={`chord-reader-line ${line.type}`}>{line.value || " "}</div>)}</div>
    </section>
  </div></>, document.body);
};

export const MinimizedChordSheetList: React.FC<MinimizedListProps> = ({ items, onRestore, onClose }) => {
  if (!items.length) return null;
  const styles = `
    .chord-minis { position:fixed; z-index:12001; left:50%; bottom:calc(var(--app-footer-height, 64px) + 10px); transform:translateX(-50%); width:min(680px,calc(100% - 24px)); max-height:40vh; overflow-y:auto; display:flex; flex-direction:column; gap:6px; }
    .chord-mini { display:flex; align-items:center; gap:10px; padding:9px 12px; color:var(--color-text-strong,#f6f7fb); background:var(--color-surface,#111827); border:1px solid var(--color-border,#475467); border-radius:14px; box-shadow:0 8px 25px #0005; }
    .chord-mini-number { flex:0 0 auto; color:var(--color-text-muted,#98a2b3); font-size:.85rem; }
    .chord-mini-name { min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:700; cursor:pointer; }
    .chord-mini button { min-height:38px; border:1px solid var(--color-border,#475467); border-radius:9px; padding:7px 10px; color:inherit; background:var(--color-surface-muted,#1f2937); font:inherit; cursor:pointer; }
    .chord-mini .chord-mini-close { width:38px; height:38px; flex:0 0 38px; display:inline-flex; align-items:center; justify-content:center; padding:0; border-radius:50%; }
    .chord-mini button:hover { border-color:var(--color-primary,#3b82f6); }
    @media(max-width:540px) { .chord-minis { max-height:35vh; } .chord-mini { gap:6px; padding:8px; } .chord-mini button { padding:6px 8px; } }
  `;
  return createPortal(<><style>{styles}</style><div className="chord-minis" role="region" aria-label="Cifras minimizadas">
    {items.map((item, index) => <div className="chord-mini" key={item.music.id || `${item.music.name}-${index}`}>
      <span className="chord-mini-number">{index + 1}.</span>
      <span className="chord-mini-name" role="button" tabIndex={0} onClick={() => onRestore(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onRestore(item); } }}>{item.music.name} · Tom {item.selectedKey}</span>
      <button type="button" onClick={() => onRestore(item)}>Reabrir</button>
      <button className="chord-mini-close" type="button" aria-label={`Fechar cifra de ${item.music.name}`} title="Fechar cifra" onClick={() => item.music.id && onClose(item.music.id)}><FaTimes /></button>
    </div>)}
  </div></>, document.body);
};

export default ChordSheetReader;
