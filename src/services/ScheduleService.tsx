import useOrganizationContext from '../context/hooks/useOrganizationContext';
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';

import type { User } from './UsersService';

export interface Musicos {
  date?: string;
  minister: string[];
  vocal: string[];
  teclas: string[];
  violao: string[];
  batera: string[];
  bass: string[];
  guita: string[];
  sound: string[];
  outfitColor?: string;
}

export interface MusicoDetalhe {
  id: string;
  label: string;
  name?: string;
  nickname?: string | null;
}

export interface MusicosDetalhados {
  minister: MusicoDetalhe[];
  vocal: MusicoDetalhe[];
  teclas: MusicoDetalhe[];
  violao: MusicoDetalhe[];
  batera: MusicoDetalhe[];
  bass: MusicoDetalhe[];
  guita: MusicoDetalhe[];
  sound: MusicoDetalhe[];
  outfitColor?: string;
}

export interface SpecialSchedule {
  id: string;
  evento: string;
  data: string;
  startTime?: string | null;
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
  assignments?: Record<string, string[]>;
  roleLabels?: Record<string, string>;
}

export interface SpecialSchedulePayload {
  id?: string;
  evento: string;
  data: string;
  startTime?: string | null;
  outfitColor?: string;
  músicosIds: Musicos;
  assignments: Record<string, string[]>;
  roleLabels: Record<string, string>;
}

interface PostSpecialSchedulesPayload {
  schedules: SpecialSchedulePayload[];
}

export interface GenerateSelectedSchedulesParams {
  scheduleIds: string[];
  dates: string[];
  mode: 'fill-empty' | 'replace';
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

const normalizeMusicianList = (value?: unknown) => {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map((item) => normalizeMusicianId(item)).filter(Boolean)));
  }

  const single = normalizeMusicianId(value);
  return single ? [single] : [];
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

const normalizeMusicianDetails = (value?: unknown) => {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
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
    minister: normalizeMusicianList(source?.minister),
    vocal: normalizeVocalList(source?.vocal, source?.vocal1, source?.vocal2),
    teclas: normalizeMusicianList(source?.teclas),
    violao: normalizeMusicianList(source?.violao),
    batera: normalizeMusicianList(source?.batera),
    bass: normalizeMusicianList(source?.bass),
    guita: normalizeMusicianList(source?.guita),
    sound: normalizeMusicianList(source?.sound),
    outfitColor: source?.outfitColor || musicos?.outfitColor || '',
  };
};

export const normalizeMusicosDetalhados = (musicos?: any): MusicosDetalhados => {
  const source = extractDisplaySource(musicos) as LegacyMusicosPayload;

  return {
    minister: normalizeMusicianDetails(source?.minister),
    vocal: normalizeVocalDetails(source?.vocal, source?.vocal1, source?.vocal2),
    teclas: normalizeMusicianDetails(source?.teclas),
    violao: normalizeMusicianDetails(source?.violao),
    batera: normalizeMusicianDetails(source?.batera),
    bass: normalizeMusicianDetails(source?.bass),
    guita: normalizeMusicianDetails(source?.guita),
    sound: normalizeMusicianDetails(source?.sound),
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
  minister: [],
  vocal: [],
  teclas: [],
  violao: [],
  batera: [],
  bass: [],
  guita: [],
  sound: [],
  outfitColor: '',
});

export const getScheduleMusicosSource = (item?: any) => {
  return item?.músicos ?? item?.musicos ?? item?.["mÃºsicos"] ?? item?.músicosIds ?? item?.musicosIds ?? item?.["mÃºsicosIds"] ?? item;
};

export const getScheduleMusicosIdsSource = (item?: any) => {
  return item?.músicosIds ?? item?.musicosIds ?? item?.["mÃºsicosIds"] ?? item?.músicos ?? item?.musicos ?? item?.["mÃºsicos"] ?? item;
};

const mergeScheduleOutfitColor = (item?: any, source?: LegacyMusicosPayload | null) => ({
  ...(source || {}),
  outfitColor: item?.outfitColor || source?.outfitColor || '',
});

void mergeScheduleOutfitColor;

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
  generateSelectedSchedules: (data: GenerateSelectedSchedulesParams) => Promise<void>;

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

  const { activeOrganizationId } = useOrganizationContext();
  const API_URL = `${import.meta.env.VITE_API_URL_PRODUTION}/organizations/${activeOrganizationId}`;

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchNextSundaySchedule = useCallback(async () => {
    if (!activeOrganizationId) { setNextSundaySchedule(null); return; }
    const res = await fetch(`${API_URL}/schedule/next-sunday`, { headers: getHeaders() });
    if (res.status === 404) { setNextSundaySchedule(null); return; }
    if (!res.ok) throw new Error("Erro ao buscar escala");
    const item = await res.json();
    setNextSundaySchedule({
      date: item.date,
      músicos: normalizeMusicosDetalhados(getScheduleMusicosSource(item)),
      músicosIds: normalizeMusicos(getScheduleMusicosIdsSource(item)),
    });
  }, [API_URL, activeOrganizationId]);

  const getScheduleForMonth = useCallback(async (monthId: string) => {
    if (!activeOrganizationId) { setMonthlySchedule([]); return; }
    const res = await fetch(`${API_URL}/schedule/${encodeURIComponent(monthId)}`, { headers: getHeaders() });
    if (res.status === 404) { setMonthlySchedule([]); return; }
    if (!res.ok) throw new Error("Erro ao buscar escala mensal");
    const data = await res.json();
    setMonthlySchedule((data.sundays || []).map((item: any) => ({
      ...item,
      músicos: normalizeMusicosDetalhados(getScheduleMusicosSource(item)),
      músicosIds: normalizeMusicos(getScheduleMusicosIdsSource(item)),
    })));
  }, [API_URL, activeOrganizationId]);

  useEffect(() => {
    const monthId = `${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`;
    void getScheduleForMonth(monthId).catch(() => setMonthlySchedule([]));
    void fetchNextSundaySchedule().catch(() => setNextSundaySchedule(null));
  }, [getScheduleForMonth, fetchNextSundaySchedule]);

  const saveOrUpdateSchedule = async (schedule: UpsertScheduleParams) => {
    try {
      const res = await fetch(`${API_URL}/schedule/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(schedule),
      });

      if (!res.ok) throw new Error('Erro ao salvar escala');
      await Promise.all([
        getScheduleForMonth(`${schedule.month}-${schedule.year}`),
        fetchNextSundaySchedule(),
      ]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const generateSelectedSchedules = async (params: GenerateSelectedSchedulesParams) => {
    const res = await fetch(`${API_URL}/schedule/special-schedule/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      let message = 'Não foi possível gerar as escalas selecionadas';
      try {
        const data = await res.json();
        message = data?.message || data?.error || message;
      } catch {
        // Mantém a mensagem amigável quando o backend ainda não retorna JSON.
      }
      throw new Error(message);
    }

    await getSpecialSchedules();
  };

  const getSpecialSchedules = useCallback(async () => {
    if (!activeOrganizationId) { setSpecialSchedules([]); return; }
    try {
      const res = await fetch(`${API_URL}/schedule/special-schedule`, { headers: getHeaders() });
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
    void getSpecialSchedules().catch(() => undefined);
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
        generateSelectedSchedules,
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
