import { useContext } from "react";
import { VideoPlayerContext } from "../videoPlayerContext";

const useVideoPlayerContext = () => {
  const context = useContext(VideoPlayerContext);
  if (!context) throw new Error("useVideoPlayerContext deve ser usado dentro de VideoPlayerProvider");
  return context;
};

export default useVideoPlayerContext;
