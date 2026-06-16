import { doc, onSnapshot } from 'firebase/firestore';
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { db } from '../firebaseConfig';

export interface Musicos {
  date?: string;
  minister: string;
  vocal: string[];
  teclas: string;
  violao: string;
  batera: string;
  bass: string;
  guita: string;
  sound: string;
  outfitColor?: string;
}

export interface SpecialSchedule {
  id: string;
  evento: string;
  data: string;
  minister: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  violao: string;
  batera: string;
  bass: string;
  guita: string;
  sound: string;
  outfitColor?: string;
}

interface PostSpecialSchedulesPayload {
  schedules: SpecialSchedule[];
}

interface GenerateMonthlyScheduleParams {
  month: string;
  year: string;
}

type LegacyMusicosPayload = Partial<Omit<Musicos, 'vocal'>> & {
  vocal?: string[] | string;
  vocal1?: string;
  vocal2?: string;
};

const normalizeVocalList = (value: LegacyMusicosPayload['vocal'], vocal1?: string, vocal2?: string) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [vocal1, vocal2].filter((item): item is string => Boolean(item && item.trim()));
};

export const normalizeMusicos = (musicos?: LegacyMusicosPayload | null): Musicos => ({
  date: musicos?.date,
  minister: musicos?.minister || '',
  vocal: normalizeVocalList(musicos?.vocal, musicos?.vocal1, musicos?.vocal2),
  teclas: musicos?.teclas || '',
  violao: musicos?.violao || '',
  batera: musicos?.batera || '',
  bass: musicos?.bass || '',
  guita: musicos?.guita || '',
  sound: musicos?.sound || '',
  outfitColor: musicos?.outfitColor || '',
});

export const formatVocalList = (vocal: string[] | undefined | null) => {
  if (!vocal || vocal.length === 0) return 'Não definido';
  return vocal.join(', ');
};

export const createEmptyMusicos = (): Musicos => ({
  minister: '',
  vocal: [],
  teclas: '',
  violao: '',
  batera: '',
  bass: '',
  guita: '',
  sound: '',
  outfitColor: '',
});

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
  generateMonthlySchedule: (data: GenerateMonthlyScheduleParams) => Promise<void>;

  specialSchedules: SpecialSchedule[] | null;
  getSpecialSchedules: () => Promise<void>;
  postSpecialSchedules: (schedules: PostSpecialSchedulesPayload) => Promise<void>;
  deleteSpecialSchedules: (id: string) => Promise<void>;
}

export const SchedulesService = createContext<ScheduleContextProps | undefined>(undefined);

export const SchedulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nextSundaySchedule, setNextSundaySchedule] = useState<Schedule | null>(null);
  const [monthlySchedule, setMonthlySchedule] = useState<Schedule[] | null>(null);
  const [specialSchedules, setSpecialSchedules] = useState<SpecialSchedule[]>([]);
  const monthlyUnsubscribeRef = useRef<(() => void) | null>(null);
  const nextSundayUnsubscribeRef = useRef<(() => void) | null>(null);

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchNextSundaySchedule = useCallback(() => {
    if (nextSundayUnsubscribeRef.current) {
      nextSundayUnsubscribeRef.current();
      nextSundayUnsubscribeRef.current = null;
    }

    const today = new Date();
    const day = today.getDay();
    const diff = (7 - day) % 7;

    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + diff);
    nextSunday.setHours(0, 0, 0, 0);

    const nextSundayISO = nextSunday.toISOString().split('T')[0];

    const month = String(nextSunday.getMonth() + 1).padStart(2, '0');
    const year = nextSunday.getFullYear();
    const monthId = `${month}-${year}`;

    const docRef = doc(db, 'schedules', monthId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setNextSundaySchedule(null);
          return;
        }

        const data = snapshot.data();
        const sundays = Array.isArray(data?.sundays) ? data.sundays : [];

        const match = sundays.find((s) => {
          const firebaseDate = new Date(s.date).toISOString().split('T')[0];
          return firebaseDate === nextSundayISO;
        });

        if (!match) {
          setNextSundaySchedule(null);
          return;
        }

        setNextSundaySchedule({
          date: nextSundayISO,
          músicos: normalizeMusicos(match.músicos),
        });
      },
      (error) => {
        console.error('Erro ao buscar escala do próximo domingo:', error);
        setNextSundaySchedule(null);
      }
    );

    nextSundayUnsubscribeRef.current = unsubscribe;
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsub = fetchNextSundaySchedule();
    return () => unsub && unsub();
  }, [fetchNextSundaySchedule]);

  const getScheduleForMonth = useCallback((monthId: string) => {
    if (monthlyUnsubscribeRef.current) {
      monthlyUnsubscribeRef.current();
      monthlyUnsubscribeRef.current = null;
    }

    const docRef = doc(db, 'schedules', monthId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setMonthlySchedule([]);
          return;
        }

        const data = snapshot.data();
        const sundays = Array.isArray(data?.sundays) ? data.sundays : [];

        setMonthlySchedule(sundays.map((item) => ({
          ...item,
          músicos: normalizeMusicos(item?.músicos),
        })));
      },
      (error) => {
        console.error('Erro ao buscar escala do mês:', error);
        setMonthlySchedule([]);
      }
    );

    monthlyUnsubscribeRef.current = unsubscribe;
    return unsubscribe;
  }, []);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const formatted = `${String(month).padStart(2, '0')}-${year}`;

    getScheduleForMonth(formatted);
  }, [getScheduleForMonth]);

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

  const generateMonthlySchedule = async ({ month, year }: GenerateMonthlyScheduleParams) => {
    try {
      const res = await fetch(`${API_URL}/schedule/generate-monthly`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ month, year }),
      });

      if (!res.ok) {
        let message = 'Erro ao gerar escala automática';

        try {
          const data = await res.json();
          message = data?.message || data?.error || message;
        } catch {
          const text = await res.text();
          if (text) message = text;
        }

        throw new Error(message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

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
        throw new Error(data.message || 'Erro ao deletar evento');
      }

      setSpecialSchedules((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    getSpecialSchedules();
  }, [getSpecialSchedules]);

  useEffect(() => {
    return () => {
      monthlyUnsubscribeRef.current?.();
      nextSundayUnsubscribeRef.current?.();
    };
  }, []);

  return (
    <SchedulesService.Provider
      value={{
        nextSundaySchedule,
        monthlySchedule,
        getScheduleForMonth,
        saveOrUpdateSchedule,
        generateMonthlySchedule,
        specialSchedules,
        getSpecialSchedules,
        postSpecialSchedules,
        deleteSpecialSchedules,
      }}
    >
      {children}
    </SchedulesService.Provider>
  );
};
