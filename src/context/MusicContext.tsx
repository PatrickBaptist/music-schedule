import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  addDoc,
  setDoc
} from 'firebase/firestore';

interface MusicLink {
  id?: string;
  link: string;
  name: string;
}

interface ScheduleEntry {
  date: string;
  teclas: string;
  batera: string;
  bass: string;
  guita: string;
}

export interface MusicContextProps {
  musicLinks: MusicLink[];
  addMusicLink: (musicLink: MusicLink) => void;
  removeMusicLink: (index: number) => void;
  schedule: ScheduleEntry[];
  getCurrentSundaySchedule: () => ScheduleEntry | null;
  updateScheduleEntry: (date: string, updatedEntry: Partial<ScheduleEntry>) => void;
}

export const MusicContext = createContext<MusicContextProps | undefined>(undefined);

/*const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getCurrentSunday = (): string => {
  const today = new Date();
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() - today.getDay()); // Ajusta para o domingo atual
  return formatDate(currentSunday);
};*/

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicLinks, setMusicLinks] = useState<MusicLink[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  // Fetch initial data from Firestore
  useEffect(() => {
    const fetchMusicLinks = async () => {
      try {
        const musicLinksCollection = collection(db, "musicLinks");
        const q = query(musicLinksCollection, orderBy("name", "asc"));
        const musicLinksSnapshot = await getDocs(q);
        const musicLinksList = musicLinksSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          } as MusicLink;
        });
        setMusicLinks(musicLinksList);
      } catch (error) {
        console.error("Error fetching music links: ", error);
      }
    };

    const fetchSchedule = async () => {
      try {
        const scheduleCollection = collection(db, "schedule");
        const scheduleSnapshot = await getDocs(scheduleCollection);
        const scheduleList = scheduleSnapshot.docs.map(doc => doc.data() as ScheduleEntry);
        setSchedule(scheduleList);
      } catch (error) {
        console.error("Error fetching schedule: ", error);
      }
    };

    fetchMusicLinks();
    fetchSchedule();
  }, []);

  const getSundaysOfCurrentMonth = (): string[] => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const sundays: string[] = [];
    
    const date = new Date(currentYear, currentMonth, 1);
    
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }
  
    while (date.getMonth() === currentMonth) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      sundays.push(`${day}-${month}-${year}`);
      date.setDate(date.getDate() + 7);
    }
  
    return sundays;
  };

  const getCurrentSundaySchedule = (): ScheduleEntry | null => {
    const sundays = getSundaysOfCurrentMonth();
    const today = new Date();
    const currentSundayIndex = sundays.findIndex(sunday => {
      const [day, month, year] = sunday.split('-');
      const sundayDate = new Date(`${year}-${month}-${day}`);
      return today <= sundayDate;
    });
  
    // Use the next Sunday or the last one if no future Sundays are found in the current month
    const index = currentSundayIndex !== -1 ? currentSundayIndex : sundays.length - 1;
  
    return schedule[index % schedule.length] || null;
  };  

  const addMusicLink = async (musicLink: MusicLink) => {
    const newDoc = await addDoc(collection(db, "musicLinks"), {
      link: musicLink.link,
      name: musicLink.name
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

  const updateScheduleEntry = async (date: string, updatedEntry: Partial<ScheduleEntry>) => {
    const entryToUpdate = schedule.find(entry => entry.date === date);
    if (entryToUpdate) {
      const updatedSchedule = { ...entryToUpdate, ...updatedEntry };
      const docRef = doc(db, "schedule", date);
      await setDoc(docRef, updatedSchedule);
      setSchedule(schedule.map(entry => entry.date === date ? updatedSchedule : entry));
    }
  };

  return (
    <MusicContext.Provider value={{ musicLinks, addMusicLink, removeMusicLink, schedule, getCurrentSundaySchedule, updateScheduleEntry }}>
      {children}
    </MusicContext.Provider>
  );
};
