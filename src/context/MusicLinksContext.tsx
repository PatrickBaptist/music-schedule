import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, updateDoc, doc, limit } from 'firebase/firestore';

interface MusicLink {
  id?: string;
  link: string | null;
  name: string;
  letter: string | null;
  cifra: string | null;
  order: number;
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

  const fetchMusicLinks = async () => {
      try {
        const musicLinksCollection = collection(db, "musicLinks");
        const q = query(musicLinksCollection, orderBy("order", "asc"));
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

  useEffect(() => {
    fetchMusicLinks();
  }, []);

  const addMusicLink = async (musicLink: MusicLink) => {

    const q = query(collection(db, "musicLinks"), orderBy("order", "desc"), limit(1));
    const last = await getDocs(q);
    const lastOrder = last.docs[0]?.data()?.order ?? 0;
    const newOrder = lastOrder + 1;

    const newDoc = await addDoc(collection(db, "musicLinks"), {
      name: musicLink.name,
      link: musicLink.link || null,
      letter: musicLink.letter || null,
      cifra: musicLink.cifra || null,
      order: newOrder,
    });
    setMusicLinks([...musicLinks, { ...musicLink, id: newDoc.id, order: newOrder }]);
    await fetchMusicLinks();
  };

  const removeMusicLink = async (index: number) => {
    const linkToRemove = musicLinks[index];

    if (!linkToRemove.id) return;

    await deleteDoc(doc(db, "musicLinks", linkToRemove.id));
    const updated = musicLinks.filter((_, i) => i !== index);

    const reindexed = await Promise.all(updated.map(async (link, i) => {
      if (link.id) {
        await updateDoc(doc(db, "musicLinks", link.id), { order: i + 1 });
      }
      return { ...link, order: i + 1 };
    }));

    setMusicLinks(reindexed);
    await fetchMusicLinks();

  };

  const updateMusicLink = async (index: number, updatedLink: MusicLink & { order: number }) => {
  const original = musicLinks[index];
  if (!original.id) return;

  const oldOrder = original.order ?? 1;
  const newOrder = updatedLink.order;

  if (oldOrder !== newOrder) {
    const reordered = musicLinks.map((item) => {
      if (!item.id || item.id === original.id) return item;

      // Se a ordem mudou para cima (ex: 3 -> 2)
      if (newOrder < oldOrder) {
        if (item.order && item.order >= newOrder && item.order < oldOrder) {
          return { ...item, order: item.order + 1 }; // Empurra para cima
        }
      }

      // Se a ordem mudou para baixo (ex: 2 -> 4)
      if (newOrder > oldOrder) {
        if (item.order && item.order <= newOrder && item.order > oldOrder) {
          return { ...item, order: item.order - 1 }; // Empurra para baixo
        }
      }

      return item;
    });

    // Atualiza todos os que mudaram no Firestore
    await Promise.all(
      reordered.map((item) =>
        updateDoc(doc(db, "musicLinks", item.id!), { order: item.order })
      )
    );
  }

  // Atualiza o próprio item
  await updateDoc(doc(db, "musicLinks", original.id), {
    name: updatedLink.name,
    link: updatedLink.link,
    letter: updatedLink.letter,
    cifra: updatedLink.cifra,
    order: updatedLink.order,
  });

  // Atualiza estado local e ordena pelo order
  const refreshed = [...musicLinks];
  refreshed[index] = { ...original, ...updatedLink };
  refreshed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  setMusicLinks(refreshed);

  await fetchMusicLinks();
};

  return (
    <MusicLinksContext.Provider value={{ musicLinks, addMusicLink, removeMusicLink, updateMusicLink }}>
      {children}
    </MusicLinksContext.Provider>
  );
};