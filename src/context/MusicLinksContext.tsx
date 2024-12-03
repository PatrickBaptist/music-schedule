import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

interface MusicLink {
  id?: string;
  link: string | null;
  name: string;
  letter: string | null;
  cifra: string | null;
}

export interface MusicLinksContextProps {
  musicLinks: MusicLink[];
  addMusicLink: (musicLink: MusicLink) => void;
  removeMusicLink: (index: number) => void;
  updateMusicLink: (index: number, updatedLink: MusicLink) => void;
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
      name: musicLink.name,
      link: musicLink.link || null,
      letter: musicLink.letter || null,
      cifra: musicLink.cifra || null
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

  const updateMusicLink = async (index: number, updatedLink: MusicLink) => {
    const linkToUpdate = musicLinks[index];
    if (linkToUpdate.id) {
      const linkRef = doc(db, 'musicLinks', linkToUpdate.id);
      await updateDoc(linkRef, {
        link: updatedLink.link,
        name: updatedLink.name,
        letter: updatedLink.letter,
        cifra: updatedLink.cifra,
      });

      const updatedMusicLinks = [...musicLinks];
      updatedMusicLinks[index] = { ...updatedMusicLinks[index], ...updatedLink };
      setMusicLinks(updatedMusicLinks);
    }
  };

  return (
    <MusicLinksContext.Provider value={{ musicLinks, addMusicLink, removeMusicLink, updateMusicLink }}>
      {children}
    </MusicLinksContext.Provider>
  );
};