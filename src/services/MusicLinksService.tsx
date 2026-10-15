import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import useOrganizationContext from "../context/hooks/useOrganizationContext";
import useAuthContext from "../context/hooks/useAuthContext";

export interface MusicLink {
  id?: string;
  link: string | null;
  name: string;
  worshipMoment: string;
  letter: string | null;
  spotify: string | null;
  cifra: string | null;
  description: string | null;
  ministeredBy?: string | null;
  /** Data do culto/evento no formato YYYY-MM-DD. */
  scheduleDate?: string | null;
  order: number;
}

export interface MusicLinksContextProps {
  musicLinks: MusicLink[];
  fetchMusicLinks: () => Promise<void>;
  shareMusicByEmail: (date: string) => Promise<{ message: string; sent: number; failed: number; skipped: number }>;
  addMusicLink: (musicLink: Omit<MusicLink, "id" | "order">) => Promise<void>;
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
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const { activeOrganizationId } = useOrganizationContext();
  const { isFirebaseAuthReady } = useAuthContext();

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
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setMusicLinks([]);

    if (!activeOrganizationId || !isFirebaseAuthReady || !auth.currentUser) {
      return;
    }

    try {
      const q = query(
        collection(db, "organizations", activeOrganizationId, "musicLinks"),
        orderBy("order", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MusicLink[];

        setMusicLinks(data);
      }, (error) => {
        setMusicLinks([]);
        console.error("Erro ao escutar as músicas da organização:", error);
      });

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error("Erro ao conectar ao Firestore:", err);
      throw err;
    }
  }, [activeOrganizationId, isFirebaseAuthReady]);

  useEffect(() => {
    void fetchMusicLinks();

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [fetchMusicLinks]);

  const getOrganizationEndpoint = (path = "") => {
    if (!activeOrganizationId) {
      throw new Error("Escolha uma organização antes de alterar as músicas.");
    }

    return `${API_URL}/organizations/${encodeURIComponent(activeOrganizationId)}/musicList${path}`;
  };

  const addMusicLink = async (
    musicLink: Omit<MusicLink, "id" | "order">
  ) => {
    try {
      // Cada inclusão no repertório precisa de um ID próprio. O ID da música
      // na biblioteca não pode ser reutilizado, pois uma música pode estar em
      // repertórios de várias datas.
      const payload = { ...musicLink } as Omit<MusicLink, "order">;
      delete payload.id;

      const res = await fetch(getOrganizationEndpoint(), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao adicionar música");

    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const shareMusicByEmail = async (date: string) => {
    const res = await fetch(getOrganizationEndpoint("/share/email"), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ date }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Não foi possível enviar os e-mails.");
    return result as { message: string; sent: number; failed: number; skipped: number };
  };

  const removeMusicLink = async (id: string) => {
    try {
      const res = await fetch(getOrganizationEndpoint(`/${encodeURIComponent(id)}`), {
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
      const res = await fetch(getOrganizationEndpoint(`/${encodeURIComponent(id)}`), {
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
        shareMusicByEmail,
        addMusicLink,
        removeMusicLink,
        updateMusicLink,
      }}
    >
      {children}
    </MusicLinksService.Provider>
  );
};
