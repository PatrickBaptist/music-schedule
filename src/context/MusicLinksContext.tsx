import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface MusicLink {
  id?: string;
  link: string;
  name: string;
}

export interface MusicLinksContextProps {
  musicLinks: MusicLink[];
  addMusicLink: (musicLink: MusicLink) => void;
  removeMusicLink: (index: number) => void;
}

export const MusicLinksContext = createContext<MusicLinksContextProps | undefined>(undefined);

export const MusicLinksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicLinks, setMusicLinks] = useState<MusicLink[]>([]);

  useEffect(() => {
    const fetchMusicLinks = async () => {
      try {
        const musicLinksCollection = collection(db, "musicLinks");
        const q = query(musicLinksCollection, orderBy("name", "asc"));
        const musicLinksSnapshot = await getDocs(q);
        const musicLinksList = musicLinksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MusicLink[];
        setMusicLinks(musicLinksList);
      } catch (error) {
        console.error("Error fetching music links: ", error);
      }
    };

    fetchMusicLinks();
  }, []);

  const addMusicLink = async (musicLink: MusicLink) => {
    const newDoc = await addDoc(collection(db, "musicLinks"), {
      link: musicLink.link,
      name: musicLink.name,
    });
    setMusicLinks([...musicLinks, { ...musicLink, id: newDoc.id }]);
  };

  const removeMusicLink = async (index: number) => {
    const linkToRemove = musicLinks[index];
    if (linkToRemove.id) {
      await deleteDoc(doc(db, "musicLinks", linkToRemove.id));
      setMusicLinks(musicLinks.filter((_, i) => i !== index));
    }
  };

  return (
    <MusicLinksContext.Provider value={{ musicLinks, addMusicLink, removeMusicLink }}>
      {children}
    </MusicLinksContext.Provider>
  );
};