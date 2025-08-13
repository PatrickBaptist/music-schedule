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
}

export const SchedulesService = createContext<ScheduleContextProps | undefined>(undefined);

export const SchedulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nextSundaySchedule, setNextSundaySchedule] = useState<Schedule | null>(null);
  const [monthlySchedule, setMonthlySchedule] = useState<Schedule[] | null>(null);

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  // Buscar escala do próximo domingo
  const fetchNextSundaySchedule = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/schedule/next-sunday`);
      
      if (!res.ok) throw new Error('Erro ao buscar escala do próximo domingo');
      const data = await res.json();

      const { date, ...músicos } = data;
      setNextSundaySchedule({ date, músicos });

    } catch (err) {
      console.error(err);
    }
  }, [API_URL]);

  // Buscar escala do mês
  const getScheduleForMonth = useCallback(
    async (monthId: string) => {
      try {
        const res = await fetch(`${API_URL}/schedule/${monthId}`);
        if (!res.ok) throw new Error('Erro ao buscar escala do mês');
        const data = await res.json();
        setMonthlySchedule(data.sundays || []);
      } catch (err) {
        console.error(err);
      }
    },
    [API_URL]
  );

  // Criar ou atualizar uma escala
  const saveOrUpdateSchedule = async (schedule: UpsertScheduleParams) => {
    try {
      const res = await fetch(`${API_URL}/schedule/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      });

      if (!res.ok) throw new Error('Erro ao salvar escala');
      await fetchNextSundaySchedule(); // Atualiza a escala do próximo domingo se necessário
      await getScheduleForMonth(`${schedule.month}-${schedule.year}`); // Atualiza mês
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNextSundaySchedule();
  }, [fetchNextSundaySchedule]);

  return (
    <SchedulesService.Provider
      value={{
        nextSundaySchedule,
        monthlySchedule,
        getScheduleForMonth,
        saveOrUpdateSchedule,
      }}
    >
      {children}
    </SchedulesService.Provider>
  );
};
