import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface ServerContextProps {
  isReady: boolean;
  progress: number;
}

export const ServerContext = createContext<ServerContextProps | undefined>(undefined);

export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 2 : prev));
    }, 1000);

    const checkServer = async () => {
      try {
        const response = await fetch(`${API_URL}/ping`);
        if (response.ok) {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => setIsReady(true), 800);
        } else {
          setTimeout(checkServer, 3000);
        }
      } catch (error) {
        setTimeout(checkServer, 3000);
      }
    };

    checkServer();
    return () => clearInterval(interval);
  }, [API_URL]);

  return (
    <ServerContext.Provider value={{ isReady, progress }}>
      {children}
    </ServerContext.Provider>
  );
};