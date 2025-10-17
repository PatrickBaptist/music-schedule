import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface MusicLink {
  id?: string;
  link: string | null;
  name: string;
  letter: string | null;
  spotify: string | null;
  cifra: string | null;
  description: string | null;
  ministeredBy?: string | null;
  order: number;
}

export interface MusicLinksContextProps {
  musicLinks: MusicLink[];
  fetchMusicLinks: () => Promise<(() => void) | void>;
  addMusicLink: (
    musicLink: Omit<MusicLink, "order"> & { id?: string }
  ) => Promise<void>;
  removeMusicLink: (id: string) => Promise<void>;
  updateMusicLink: (id: string, updated: MusicLink) => Promise<void>;
}

export const MusicLinksService = createContext<
  MusicLinksContextProps | undefined
>(undefined);

export const MusicLinksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [musicLinks, setMusicLinks] = useState<MusicLink[]>([]);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  // Fetch em tempo real
  const fetchMusicLinks = useCallback(async () => {
    try {
      const q = query(collection(db, "musicLinks"), orderBy("order", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MusicLink[];

        setMusicLinks(data);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Erro ao conectar ao Firestore:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      unsubscribe = await fetchMusicLinks();
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchMusicLinks]);

  const addMusicLink = async (
    musicLink: Omit<MusicLink, "order"> & { id?: string }
  ) => {
    try {
      const res = await fetch(`${API_URL}/musicList`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(musicLink),
      });

      if (!res.ok) throw new Error("Erro ao adicionar música");

    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeMusicLink = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/musicList/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao deletar música");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateMusicLink = async (id: string, updated: MusicLink) => {
    try {
      const res = await fetch(`${API_URL}/musicList/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao atualizar música");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <MusicLinksService.Provider
      value={{
        musicLinks,
        fetchMusicLinks,
        addMusicLink,
        removeMusicLink,
        updateMusicLink,
      }}
    >
      {children}
    </MusicLinksService.Provider>
  );
};
