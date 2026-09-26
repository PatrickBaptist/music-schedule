import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { FaExpand, FaMinus, FaTimes, FaYoutube } from "react-icons/fa";
import useBodyScrollLock from "./hooks/useBodyScrollLock";
import {
  PlayerCard,
  PlayerControl,
  PlayerHeader,
  PlayerLayer,
  PlayerLoading,
  PlayerTitle,
  PlayerViewport,
} from "../components/videoPlayer/VideoPlayerStyle";

type CurrentVideo = {
  url: string;
  title: string;
};

type VideoPlayerContextValue = {
  openVideo: (url: string, title?: string) => void;
  closeVideo: () => void;
};

export const VideoPlayerContext = createContext<VideoPlayerContextValue | undefined>(undefined);

const getEmbedUrl = (source: string) => {
  try {
    const url = new URL(source);
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    if (host.endsWith("youtube.com")) {
      videoId = url.searchParams.get("v") || "";
      if (!videoId) {
        const parts = url.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "live"].includes(parts[0])) videoId = parts[1] || "";
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : source;
  } catch {
    return source;
  }
};

export const VideoPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [video, setVideo] = useState<CurrentVideo | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useBodyScrollLock(Boolean(video) && !isMinimized);

  const openVideo = useCallback((url: string, title = "Vídeo da música") => {
    setVideo({ url: getEmbedUrl(url), title });
    setIsLoading(true);
    setIsMinimized(false);
  }, []);

  const closeVideo = useCallback(() => {
    setVideo(null);
    setIsLoading(false);
    setIsMinimized(false);
  }, []);

  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isMinimized) setIsMinimized(true);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMinimized, video]);

  const value = useMemo(() => ({ openVideo, closeVideo }), [closeVideo, openVideo]);

  return (
    <VideoPlayerContext.Provider value={value}>
      {children}
      {video && (
        <PlayerLayer
          $minimized={isMinimized}
          onMouseDown={(event) => {
            if (!isMinimized && event.target === event.currentTarget) closeVideo();
          }}
        >
          <PlayerCard
            $minimized={isMinimized}
            role={isMinimized ? "region" : "dialog"}
            aria-modal={isMinimized ? undefined : "true"}
            aria-label={`Reprodutor: ${video.title}`}
          >
            <PlayerHeader>
              <PlayerTitle>
                <FaYoutube aria-hidden="true" />
                <span>{video.title}</span>
              </PlayerTitle>
              <div>
                <PlayerControl
                  type="button"
                  onClick={() => setIsMinimized((current) => !current)}
                  title={isMinimized ? "Restaurar vídeo" : "Minimizar vídeo"}
                  aria-label={isMinimized ? "Restaurar vídeo" : "Minimizar vídeo"}
                >
                  {isMinimized ? <FaExpand /> : <FaMinus />}
                </PlayerControl>
                <PlayerControl type="button" onClick={closeVideo} title="Fechar vídeo" aria-label="Fechar vídeo">
                  <FaTimes />
                </PlayerControl>
              </div>
            </PlayerHeader>
            <PlayerViewport>
              {isLoading && <PlayerLoading>Carregando vídeo...</PlayerLoading>}
              <iframe
                src={video.url}
                title={video.title}
                onLoad={() => setIsLoading(false)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </PlayerViewport>
          </PlayerCard>
        </PlayerLayer>
      )}
    </VideoPlayerContext.Provider>
  );
};
