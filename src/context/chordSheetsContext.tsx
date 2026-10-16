import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MusicLink } from "../services/MusicLinksService";
import ChordSheetReader, { MinimizedChordSheet, MinimizedChordSheetList } from "../components/musicList/ChordSheetReader";
import useOrganizationContext from "./hooks/useOrganizationContext";

type ActiveChordSheet = MinimizedChordSheet;

type ChordSheetsContextValue = {
  openChordSheet: (music: MusicLink) => void;
};

const ChordSheetsContext = createContext<ChordSheetsContextValue | undefined>(undefined);

export const ChordSheetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSheet, setActiveSheet] = useState<ActiveChordSheet | null>(null);
  const [minimizedSheets, setMinimizedSheets] = useState<MinimizedChordSheet[]>([]);
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const { activeOrganizationId } = useOrganizationContext();
  const previousOrganization = useRef(activeOrganizationId);

  const addToMinimized = useCallback((item: MinimizedChordSheet) => {
    setMinimizedSheets((items) => [
      ...items.filter((candidate) => candidate.music.id !== item.music.id),
      item,
    ]);
  }, []);

  const openChordSheet = useCallback((music: MusicLink) => {
    const queued = minimizedSheets.find((item) => item.music.id === music.id);
    if (activeSheet) addToMinimized(activeSheet);
    setActiveSheet(queued || { music, selectedKey: music.cifra || music.chordSourceKey || "C" });
    if (queued) setMinimizedSheets((items) => items.filter((item) => item.music.id !== music.id));
  }, [activeSheet, addToMinimized, minimizedSheets]);

  const minimizeActiveSheet = useCallback(() => {
    if (activeSheet) addToMinimized(activeSheet);
    setActiveSheet(null);
  }, [activeSheet, addToMinimized]);

  const restoreSheet = useCallback((item: MinimizedChordSheet) => {
    if (activeSheet) addToMinimized(activeSheet);
    setActiveSheet(item);
    setMinimizedSheets((items) => items.filter((candidate) => candidate.music.id !== item.music.id));
  }, [activeSheet, addToMinimized]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    minimizeActiveSheet();
  }, [pathname, minimizeActiveSheet]);

  useEffect(() => {
    if (previousOrganization.current === activeOrganizationId) return;
    previousOrganization.current = activeOrganizationId;
    setActiveSheet(null);
    setMinimizedSheets([]);
  }, [activeOrganizationId]);

  return <ChordSheetsContext.Provider value={{ openChordSheet }}>
    {children}
    {activeSheet && <ChordSheetReader
      music={activeSheet.music}
      selectedKey={activeSheet.selectedKey}
      onKeyChange={(key) => setActiveSheet((current) => current ? { ...current, selectedKey: key } : null)}
      onMinimize={minimizeActiveSheet}
      onClose={() => setActiveSheet(null)}
    />}
    <MinimizedChordSheetList
      items={minimizedSheets}
      onRestore={restoreSheet}
      onClose={(id) => setMinimizedSheets((items) => items.filter((item) => item.music.id !== id))}
    />
  </ChordSheetsContext.Provider>;
};

export const useChordSheets = () => {
  const context = useContext(ChordSheetsContext);
  if (!context) throw new Error("useChordSheets must be used within ChordSheetsProvider");
  return context;
};
