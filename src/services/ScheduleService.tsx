import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '../firebaseConfig';

export interface Musicos {
  date?: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  violao: string;
  batera: string;
  bass: string;
  guita: string;
  outfitColor?: string;
}

export interface SpecialSchedule {
  id: string;
  evento: string;
  data: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  violao: string;
  batera: string;
  bass: string;
  guita: string;
  outfitColor?: string;
}

interface PostSpecialSchedulesPayload {
  schedules: SpecialSchedule[];
}

export interface Schedule {
  date: string;
  músicos: Musicos;
}

interface UpsertScheduleParams {
  month: string;
  year: string;
  date: string;
  músicos: Musicos;
}

export interface ScheduleContextProps {
  nextSundaySchedule: Schedule | null;
  monthlySchedule: Schedule[] | null;
  getScheduleForMonth: (monthId: string) => void;
  saveOrUpdateSchedule: (data: UpsertScheduleParams) => Promise<void>;

  specialSchedules: SpecialSchedule[] | null;
  getSpecialSchedules: () => Promise<void>;
  postSpecialSchedules: (schedules: PostSpecialSchedulesPayload) => Promise<void>;
  deleteSpecialSchedules: ( id: string ) => Promise<void>;
}

export const SchedulesService = createContext<ScheduleContextProps | undefined>(undefined);

export const SchedulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nextSundaySchedule, setNextSundaySchedule] = useState<Schedule | null>(null);
  const [monthlySchedule, setMonthlySchedule] = useState<Schedule[] | null>(null);
  const [specialSchedules, setSpecialSchedules] = useState<SpecialSchedule[]>([]);
  
  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchNextSundaySchedule = useCallback(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = (7 - day) % 7;

    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + diff);
    nextSunday.setHours(0, 0, 0, 0);

    const nextSundayISO = nextSunday.toISOString().split("T")[0];

    const month = String(nextSunday.getMonth() + 1).padStart(2, "0");
    const year = nextSunday.getFullYear();
    const monthId = `${month}-${year}`;

    const docRef = doc(db, "schedules", monthId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        setNextSundaySchedule(null);
        return;
      }

      const data = snapshot.data();
      const sundays = Array.isArray(data?.sundays) ? data.sundays : [];

    const match = sundays.find((s) => {
      const firebaseDate = new Date(s.date).toISOString().split("T")[0];
      return firebaseDate === nextSundayISO;
    });

    if (!match) {
      setNextSundaySchedule(null);
      return;
    }

    setNextSundaySchedule({
      date: nextSundayISO,
      músicos: match.músicos,
    });
  });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsub = fetchNextSundaySchedule();
    return () => unsub && unsub();
  }, [fetchNextSundaySchedule]);

  const getScheduleForMonth = useCallback((monthId: string) => {
    const docRef = doc(db, "schedules", monthId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        setMonthlySchedule([]);
        return;
      }

      const data = snapshot.data();
      const sundays = Array.isArray(data?.sundays) ? data.sundays : [];

      setMonthlySchedule(sundays);
    },
    (error) => {
      console.error("Erro ao buscar escala do mês:", error);
      setMonthlySchedule([]);
    }
  );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const formatted = `${String(month).padStart(2, "0")}-${year}`;

    getScheduleForMonth(formatted);
  }, [getScheduleForMonth]);

  // Criar ou atualizar uma escala
  const saveOrUpdateSchedule = async (schedule: UpsertScheduleParams) => {
    try {
      const res = await fetch(`${API_URL}/schedule/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(schedule),
      });

      if (!res.ok) throw new Error('Erro ao salvar escala');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Escalas especiais
  const getSpecialSchedules = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/schedule/special-schedule`);
      if (!res.ok) throw new Error('Erro ao buscar escalas especiais');
      const data = await res.json();
      setSpecialSchedules(data || []);
    } catch (err) {
      console.error(err);
      setSpecialSchedules([]);
      throw err;
    }
  }, [API_URL]);

  const postSpecialSchedules = async (payload: PostSpecialSchedulesPayload) => {
    try {
      const res = await fetch(`${API_URL}/schedule/special-schedule`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro ao salvar escalas especiais');
      await getSpecialSchedules();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteSpecialSchedules = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/schedule/special-schedule/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao deletar evento");
      }

      setSpecialSchedules(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    getSpecialSchedules();
  }, [getSpecialSchedules]);

  return (
    <SchedulesService.Provider
      value={{
        nextSundaySchedule,
        monthlySchedule,
        getScheduleForMonth,
        saveOrUpdateSchedule,
        specialSchedules,
        getSpecialSchedules,
        postSpecialSchedules,
        deleteSpecialSchedules
      }}
    >
      {children}
    </SchedulesService.Provider>
  );
};
