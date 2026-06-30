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
import type { User } from './UsersService';

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

export interface MusicoDetalhe {
  id: string;
  label: string;
  name?: string;
  nickname?: string | null;
}

export interface MusicosDetalhados {
  minister: MusicoDetalhe | null;
  vocal: MusicoDetalhe[];
  teclas: MusicoDetalhe | null;
  violao: MusicoDetalhe | null;
  batera: MusicoDetalhe | null;
  bass: MusicoDetalhe | null;
  guita: MusicoDetalhe | null;
  sound: MusicoDetalhe | null;
  outfitColor?: string;
}

export interface SpecialSchedule {
  id: string;
  evento: string;
  data: string;
  minister?: string;
  vocal1?: string;
  vocal2?: string;
  teclas?: string;
  violao?: string;
  batera?: string;
  bass?: string;
  guita?: string;
  sound?: string;
  outfitColor?: string;
  músicos?: MusicosDetalhados;
  musicos?: MusicosDetalhados;
  músicosIds?: Musicos;
  musicosIds?: Musicos;
}

export interface SpecialSchedulePayload {
  id?: string;
  evento: string;
  data: string;
  outfitColor?: string;
  músicosIds: Musicos;
}

interface PostSpecialSchedulesPayload {
  schedules: SpecialSchedulePayload[];
}

interface GenerateMonthlyScheduleParams {
  month: number;
  year: number;
}

type LegacyMusicosPayload = Record<string, any>;

const normalizeMusicianId = (value?: any) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.id || '';
};

const normalizeMusicianDetail = (value?: any): MusicoDetalhe | null => {
  if (!value) return null;

  if (typeof value === 'string') {
    return {
      id: value,
      label: value,
      name: value,
      nickname: value,
    };
  }

  const id = value.id || '';
  const label = value.label || value.nickname || value.name || id || '';

  return {
    id,
    label,
    name: value.name || label || id || '',
    nickname: value.nickname ?? label ?? value.name ?? id,
  };
};

const resolveUserLike = (value: string, userLookup?: Record<string, User>) => {
  if (!userLookup) return null;

  return (
    userLookup[value] ||
    Object.values(userLookup).find(
      (user) =>
        user.id === value ||
        user.nickname === value ||
        user.name === value
    ) ||
    null
  );
};

const normalizeVocalList = (value?: any, vocal1?: any, vocal2?: any) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeMusicianId(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    const parsed = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    return parsed.length > 0 ? parsed : [value].filter(Boolean);
  }

  return [vocal1, vocal2]
    .map((item) => normalizeMusicianId(item))
    .filter((item): item is string => Boolean(item));
};

const normalizeVocalDetails = (value?: any, vocal1?: any, vocal2?: any) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeMusicianDetail(item))
      .filter((item): item is MusicoDetalhe => Boolean(item));
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => normalizeMusicianDetail(item))
      .filter((item): item is MusicoDetalhe => Boolean(item));
  }

  return [vocal1, vocal2]
    .map((item) => normalizeMusicianDetail(item))
    .filter((item): item is MusicoDetalhe => Boolean(item));
};

const extractIdsSource = (musicos?: LegacyMusicosPayload | null) => {
  return (
    musicos?.músicosIds ||
    musicos?.musicosIds ||
    musicos?.["mÃºsicosIds"] ||
    musicos?.músicasIds ||
    musicos?.musicasIds ||
    musicos?.músicos ||
    musicos?.musicos ||
    musicos?.["mÃºsicos"] ||
    musicos ||
    null
  );
};

const extractDisplaySource = (musicos?: LegacyMusicosPayload | null) => {
  return (
    musicos?.músicos ||
    musicos?.musicos ||
    musicos?.["mÃºsicos"] ||
    musicos?.músicosIds ||
    musicos?.musicosIds ||
    musicos?.["mÃºsicosIds"] ||
    musicos?.músicasIds ||
    musicos?.musicasIds ||
    musicos ||
    null
  );
};

export const normalizeMusicos = (musicos?: any): Musicos => {
  const source = extractIdsSource(musicos) as LegacyMusicosPayload;

  return {
    date: musicos?.date,
    minister: normalizeMusicianId(source?.minister) || '',
    vocal: normalizeVocalList(source?.vocal, source?.vocal1, source?.vocal2),
    teclas: normalizeMusicianId(source?.teclas) || '',
    violao: normalizeMusicianId(source?.violao) || '',
    batera: normalizeMusicianId(source?.batera) || '',
    bass: normalizeMusicianId(source?.bass) || '',
    guita: normalizeMusicianId(source?.guita) || '',
    sound: normalizeMusicianId(source?.sound) || '',
    outfitColor: source?.outfitColor || musicos?.outfitColor || '',
  };
};

export const normalizeMusicosDetalhados = (musicos?: any): MusicosDetalhados => {
  const source = extractDisplaySource(musicos) as LegacyMusicosPayload;

  return {
    minister: normalizeMusicianDetail(source?.minister),
    vocal: normalizeVocalDetails(source?.vocal, source?.vocal1, source?.vocal2),
    teclas: normalizeMusicianDetail(source?.teclas),
    violao: normalizeMusicianDetail(source?.violao),
    batera: normalizeMusicianDetail(source?.batera),
    bass: normalizeMusicianDetail(source?.bass),
    guita: normalizeMusicianDetail(source?.guita),
    sound: normalizeMusicianDetail(source?.sound),
    outfitColor: source?.outfitColor || musicos?.outfitColor || '',
  };
};

export const getMusicianDisplayName = (
  musician?: string | MusicoDetalhe | null,
  userLookup?: Record<string, User>,
  fallback = 'Não definido'
) => {
  if (!musician) return fallback;

  if (typeof musician !== 'string') {
    return musician.label || musician.nickname || musician.name || musician.id || fallback;
  }

  const user = resolveUserLike(musician, userLookup);
  if (user) {
    return user.nickname || user.name || user.id || fallback;
  }

  return musician || fallback;
};

export const getMusicianPhotoURL = (
  musician?: string | MusicoDetalhe | null,
  userLookup?: Record<string, User>
) => {
  if (!musician) return '';

  if (typeof musician !== 'string') {
    return resolveUserLike(musician.id, userLookup)?.photoURL || '';
  }

  return resolveUserLike(musician, userLookup)?.photoURL || '';
};

export const formatVocalList = (
  vocal: Array<string | MusicoDetalhe> | undefined | null,
  userLookup?: Record<string, User>
) => {
  if (!vocal || vocal.length === 0) return 'Não definido';
  return vocal
    .map((item) => getMusicianDisplayName(item, userLookup, ''))
    .filter(Boolean)
    .join(', ');
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

export const getScheduleMusicosSource = (item?: any) => {
  return item?.músicos ?? item?.musicos ?? item?.["mÃºsicos"] ?? item?.músicosIds ?? item?.musicosIds ?? item?.["mÃºsicosIds"] ?? item;
};

export const getScheduleMusicosIdsSource = (item?: any) => {
  return item?.músicosIds ?? item?.musicosIds ?? item?.["mÃºsicosIds"] ?? item?.músicos ?? item?.musicos ?? item?.["mÃºsicos"] ?? item;
};

export interface Schedule {
  date: string;
  músicos: MusicosDetalhados;
  músicosIds: Musicos;
}

interface UpsertScheduleParams {
  month: string;
  year: number;
  date: string;
  músicosIds: Musicos;
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
          músicos: normalizeMusicosDetalhados(getScheduleMusicosSource(match)),
          músicosIds: normalizeMusicos(getScheduleMusicosIdsSource(match)),
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

        setMonthlySchedule(
          sundays.map((item) => ({
            ...item,
            músicos: normalizeMusicosDetalhados(getScheduleMusicosSource(item)),
            músicosIds: normalizeMusicos(getScheduleMusicosIdsSource(item)),
          }))
        );
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
      const schedules = Array.isArray(data) ? data : [];
      setSpecialSchedules(
        schedules.map((item) => ({
          ...item,
          músicos: normalizeMusicosDetalhados(getScheduleMusicosSource(item)),
          músicosIds: normalizeMusicos(getScheduleMusicosIdsSource(item)),
        }))
      );
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
