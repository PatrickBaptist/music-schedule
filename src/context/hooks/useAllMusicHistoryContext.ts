import { useContext } from "react";
import { AllMusicLinksContextProps, AllMusicLinksService } from "../../services/AllMusicHistory";

const useAllMusicHistoryContext = (): AllMusicLinksContextProps => {
  const context = useContext(AllMusicLinksService);
  if (!context) {
    throw new Error("useLoginContext precisa estar dentro de LoginProvider");
  }

  return context;
};

export default useAllMusicHistoryContext;
