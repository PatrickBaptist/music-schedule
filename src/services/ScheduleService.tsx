import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Musicos {
  date?: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  violao: string;
  batera: string;
  bass: string;
  guita: string;
}

export interface SpecialSchedule {
  evento: string;
  data: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  violao: string;
  batera: string;
  bass: string;
  guita: string;
}

interface PostSpecialSchedulesPayload {
  schedules: SpecialSchedule[];
}

interface Schedule {
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
  getScheduleForMonth: (monthId: string) => Promise<void>;
  saveOrUpdateSchedule: (data: UpsertScheduleParams) => Promise<void>;

  specialSchedules: SpecialSchedule[] | null;
  getSpecialSchedules: () => Promise<void>;
  postSpecialSchedules: (schedules: PostSpecialSchedulesPayload) => Promise<void>;
  deleteSpecialSchedules: () => Promise<void>;
}

export const SchedulesService = createContext<ScheduleContextProps | undefined>(undefined);

export const SchedulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nextSundaySchedule, setNextSundaySchedule] = useState<Schedule | null>(null);
  const [monthlySchedule, setMonthlySchedule] = useState<Schedule[] | null>(null);
  const [specialSchedules, setSpecialSchedules] = useState<SpecialSchedule[] | null>(null);
  
  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchNextSundaySchedule = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/schedule/next-sunday`);
      
      if (!res.ok) throw new Error('Erro ao buscar escala do próximo domingo');
      const data = await res.json();

      const { date, ...músicos } = data;
      setNextSundaySchedule({ date, músicos });

    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [API_URL]);

  // Buscar escala do mês
  const getScheduleForMonth = useCallback(async (monthId: string) => {
      try {
        const res = await fetch(`${API_URL}/schedule/${monthId}`);
        if (!res.ok) throw new Error('Erro ao buscar escala do mês');
        const data = await res.json();
        setMonthlySchedule(data.sundays || []);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    [API_URL]
  );

  // Criar ou atualizar uma escala
  const saveOrUpdateSchedule = async (schedule: UpsertScheduleParams) => {
    try {
      const res = await fetch(`${API_URL}/schedule/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(schedule),
      });

      if (!res.ok) throw new Error('Erro ao salvar escala');
      await fetchNextSundaySchedule(); // Atualiza a escala do próximo domingo se necessário
      await getScheduleForMonth(`${schedule.month}-${schedule.year}`); // Atualiza mês
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchNextSundaySchedule();
  }, [fetchNextSundaySchedule]);

  // Escalas especiais
  const getSpecialSchedules = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/schedule/special-schedule`);
      if (!res.ok) throw new Error('Erro ao buscar escalas especiais');
      const data = await res.json();
      setSpecialSchedules(data.schedules || []);
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

  const deleteSpecialSchedules = async () => {
    try {
      const res = await fetch(`${API_URL}/schedule/special-schedule`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao deletar evento");
      }

      setSpecialSchedules([]);
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
