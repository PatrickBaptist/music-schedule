import { useContext } from "react";
import { ScrollContext, ScrollContextType } from "../scrollContext";

export const useScroll = (): ScrollContextType => {
    
  const context = useContext(ScrollContext);
  if (!context) throw new Error("useScroll must be used within ScrollProvider");
  return context;
};