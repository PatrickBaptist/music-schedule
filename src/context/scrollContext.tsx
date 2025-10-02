import React, { createContext, useRef, ReactNode } from "react";

export interface ScrollContextType {
  scrollToTop: () => void;
  routesRef: React.RefObject<HTMLDivElement>;
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const routesRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    routesRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ScrollContext.Provider value={{ scrollToTop, routesRef }}>
      {children}
    </ScrollContext.Provider>
  );
};