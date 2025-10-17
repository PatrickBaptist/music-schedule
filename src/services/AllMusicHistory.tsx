import React, { useState, useCallback, ReactNode, createContext } from "react";
import { FirestoreTimestamp } from "../helpers/helpers";

interface AllMusicLink {
  id: string;
  name: string;
  link?: string | null;
  letter?: string | null;
  spotify?: string | null;
  cifra?: string | null;
  description?: string | null;
  createdAt?: string | Date | FirestoreTimestamp;
  minister?: string | null;
}

interface ApiResponse {
  page: number;
  limit: number;
  results: AllMusicLink[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AllMusicLinksContextProps {
  musicLinks: AllMusicLink[];
  loading: boolean;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;

  getAllMusicLinks: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  addMusicLink: (data: Omit<AllMusicLink, "id" | "createdAt">) => Promise<void>;
  updateMusicLink: (id: string, data: Partial<AllMusicLink>) => Promise<void>;
  removeMusicLink: (id: string) => Promise<void>;
}

export const AllMusicLinksService = createContext<AllMusicLinksContextProps | undefined>(undefined);

export const AllMusicLinksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicLinks, setMusicLinks] = useState<AllMusicLink[]>([]);
  const [loading, setLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const getHeaders = () => {  
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getAllMusicLinks = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (params?.page) query.append("page", String(params.page));
        if (params?.limit) query.append("limit", String(params.limit));
        if (params?.search) query.append("search", params.search);

        const res = await fetch(`${API_URL}/allMusicLinks?${query.toString()}`, {
          headers: getHeaders(),
        });

        const data: ApiResponse & { hasNextPage: boolean; hasPrevPage: boolean } = await res.json();

        setMusicLinks(data.results);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
        setCurrentPage(data.page);  
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const addMusicLink = async (music: Omit<AllMusicLink, "id" | "createdAt">) => {
    try {
      const res = await fetch(`${API_URL}/allMusicLinks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(music),
      });

      if (!res.ok) throw new Error("Erro ao adicionar música");
      
      await getAllMusicLinks();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateMusicLink = async (id?: string, music?: Partial<AllMusicLink>) => {
    if (!id || !music) throw new Error("ID e dados da música são obrigatórios");

    try {
      const res = await fetch(`${API_URL}/allMusicLinks/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(music),
      });

      if (!res.ok) throw new Error("Erro ao atualizar música");
      await getAllMusicLinks();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeMusicLink = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/allMusicLinks/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao deletar música");
      await getAllMusicLinks();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AllMusicLinksService.Provider
      value={{ musicLinks, loading, hasNextPage, hasPrevPage, currentPage, getAllMusicLinks, addMusicLink, updateMusicLink, removeMusicLink }}
    >
      {children}
    </AllMusicLinksService.Provider>
  );
};