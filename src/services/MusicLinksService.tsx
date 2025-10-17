import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';

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
  fetchMusicLinks: () => Promise<void>;
  addMusicLink: (musicLink: Omit<MusicLink, 'order'> & { id?: string }) => Promise<void>;
  removeMusicLink: (id: string) => Promise<void>;
  updateMusicLink: (id: string, updated: MusicLink) => Promise<void>;
}

export const MusicLinksService = createContext<MusicLinksContextProps | undefined>(undefined);

export const MusicLinksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicLinks, setMusicLinks] = useState<MusicLink[]>([]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const fetchMusicLinks = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/musicList`);
      const data = await res.json();
      const sorted = data.sort((a: MusicLink, b: MusicLink) => a.order - b.order);
      setMusicLinks(sorted);
    } catch (err) {
      console.error('Erro ao buscar músicas:', err);
      throw err;
    }
  }, [API_URL]);

  useEffect(() => {
    fetchMusicLinks();
  }, [fetchMusicLinks]);

  const addMusicLink = async (musicLink: Omit<MusicLink, 'order'> & { id?: string }) => {
    try {
      const res = await fetch(`${API_URL}/musicList`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(musicLink),
      });

      if (!res.ok) throw new Error('Erro ao adicionar música');

      await fetchMusicLinks();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeMusicLink = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/musicList/${id}`, { 
        method: 'DELETE', 
        headers: getHeaders()
      });
      
      if (!res.ok) throw new Error('Erro ao deletar música');
      await fetchMusicLinks();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateMusicLink = async (id: string, updated: MusicLink) => {
    try {
      const res = await fetch(`${API_URL}/musicList/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Erro ao atualizar música');
      await fetchMusicLinks();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <MusicLinksService.Provider value={{ musicLinks, fetchMusicLinks, addMusicLink, removeMusicLink, updateMusicLink }}>
      {children}
    </MusicLinksService.Provider>
  );
};