import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import useAuthContext from '../context/hooks/useAuthContext';
import useSchedulesContext from '../context/hooks/useScheduleContext';
import { db } from '../firebaseConfig';
import {
  getScheduleMusicosIdsSource,
  getScheduleMusicosSource,
  MusicoDetalhe,
  normalizeMusicos,
  normalizeMusicosDetalhados,
  Schedule,
  SpecialSchedule,
} from './ScheduleService';

type RoleKey = 'minister' | 'vocal' | 'teclas' | 'violao' | 'batera' | 'bass' | 'guita' | 'sound';

type LoggedUser = {
  id: string;
  name?: string;
  nickname?: string;
};

export type PersonalAssignment = {
  id: string;
  date: Date;
  title: string;
  type: 'Domingo' | 'Especial';
  roles: string[];
  outfitColor: string;
};

type MyScheduleContextProps = {
  assignments: PersonalAssignment[];
  isLoading: boolean;
  loadError: boolean;
  hasUnseenAssignments: boolean;
  markAssignmentsAsSeen: () => void;
};

export const MyScheduleService = createContext<MyScheduleContextProps | undefined>(undefined);

const roleLabels: Array<{ key: RoleKey; label: string }> = [
  { key: 'minister', label: 'Ministro' },
  { key: 'vocal', label: 'Vocal' },
  { key: 'teclas', label: 'Teclado' },
  { key: 'violao', label: 'Violão' },
  { key: 'batera', label: 'Bateria' },
  { key: 'bass', label: 'Baixo' },
  { key: 'guita', label: 'Guitarra' },
  { key: 'sound', label: 'Operador de som' },
];

const normalizeReference = (value?: string | null) => value?.trim().toLocaleLowerCase('pt-BR') || '';

const isCurrentUser = (reference: string | MusicoDetalhe, user: LoggedUser) => {
  const userReferences = [user.id, user.nickname, user.name]
    .map(normalizeReference)
    .filter(Boolean);

  if (typeof reference === 'string') {
    return userReferences.includes(normalizeReference(reference));
  }

  return [reference.id, reference.nickname, reference.name, reference.label]
    .map(normalizeReference)
    .filter(Boolean)
    .some((value) => userReferences.includes(value));
};

const getScheduleRoles = (schedule: Schedule, user: LoggedUser) => roleLabels
  .filter(({ key }) => [
    ...schedule.músicosIds[key],
    ...schedule.músicos[key],
  ].some((reference) => isCurrentUser(reference, user)))
  .map(({ label }) => label);

const getLegacySpecialPeople = (schedule: SpecialSchedule, key: RoleKey) => {
  if (key === 'vocal') return [schedule.vocal1, schedule.vocal2].filter((value): value is string => Boolean(value));
  const value = schedule[key];
  return value ? [value] : [];
};

const getSpecialScheduleRoles = (schedule: SpecialSchedule, user: LoggedUser) => roleLabels
  .filter(({ key }) => [
    ...(schedule.músicosIds?.[key] || []),
    ...(schedule.musicosIds?.[key] || []),
    ...(schedule.músicos?.[key] || []),
    ...(schedule.musicos?.[key] || []),
    ...getLegacySpecialPeople(schedule, key),
  ].some((reference) => isCurrentUser(reference, user)))
  .map(({ label }) => label);

const parseLocalDate = (value: string) => {
  const dateOnly = value.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  if (year && month && day) return new Date(year, month - 1, day);
  return new Date(value);
};

const getMonthIds = () => {
  const today = new Date();
  return [0, 1].map((offset) => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  });
};

const getFingerprint = (assignments: PersonalAssignment[]) => JSON.stringify(
  assignments.map((assignment) => ({
    id: assignment.id,
    date: assignment.date.toISOString(),
    roles: assignment.roles,
    outfitColor: assignment.outfitColor,
  }))
);

export const MyScheduleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const { specialSchedules } = useSchedulesContext();
  const [monthlySchedules, setMonthlySchedules] = useState<Record<string, Schedule[]>>({});
  const [loadedMonths, setLoadedMonths] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [seenFingerprint, setSeenFingerprint] = useState('');
  const monthIds = useMemo(getMonthIds, []);

  useEffect(() => {
    setLoadedMonths([]);
    setLoadError(false);

    const unsubscribes = monthIds.map((monthId) => onSnapshot(
      doc(db, 'schedules', monthId),
      (snapshot) => {
        const data = snapshot.data();
        const sundays = Array.isArray(data?.sundays) ? data.sundays : [];
        const schedules = sundays.map((item) => ({
          date: String(item?.date || ''),
          músicos: normalizeMusicosDetalhados(getScheduleMusicosSource(item)),
          músicosIds: normalizeMusicos(getScheduleMusicosIdsSource(item)),
        }));

        setMonthlySchedules((current) => ({ ...current, [monthId]: schedules }));
        setLoadedMonths((current) => current.includes(monthId) ? current : [...current, monthId]);
      },
      (error) => {
        console.error(`Erro ao carregar a escala de ${monthId}:`, error);
        setLoadError(true);
        setLoadedMonths((current) => current.includes(monthId) ? current : [...current, monthId]);
      }
    ));

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [monthIds]);

  const assignments = useMemo(() => {
    if (!user) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const loggedUser: LoggedUser = user;

    const regularAssignments = monthIds
      .flatMap((monthId) => monthlySchedules[monthId] || [])
      .map((schedule): PersonalAssignment | null => {
        const roles = getScheduleRoles(schedule, loggedUser);
        const date = parseLocalDate(schedule.date);
        if (roles.length === 0 || Number.isNaN(date.getTime()) || date < today) return null;

        return {
          id: `sunday-${schedule.date}`,
          date,
          title: 'Culto de domingo',
          type: 'Domingo',
          roles,
          outfitColor: schedule.músicosIds.outfitColor || schedule.músicos.outfitColor || '',
        };
      })
      .filter((assignment): assignment is PersonalAssignment => Boolean(assignment));

    const specialAssignments = (specialSchedules || [])
      .map((schedule): PersonalAssignment | null => {
        const roles = getSpecialScheduleRoles(schedule, loggedUser);
        const date = parseLocalDate(schedule.data);
        if (roles.length === 0 || Number.isNaN(date.getTime()) || date < today) return null;

        return {
          id: `special-${schedule.id || schedule.data}-${schedule.evento}`,
          date,
          title: schedule.evento || 'Escala especial',
          type: 'Especial',
          roles,
          outfitColor: schedule.outfitColor || schedule.músicosIds?.outfitColor || schedule.musicosIds?.outfitColor || schedule.músicos?.outfitColor || schedule.musicos?.outfitColor || '',
        };
      })
      .filter((assignment): assignment is PersonalAssignment => Boolean(assignment));

    return [...regularAssignments, ...specialAssignments]
      .sort((first, second) => first.date.getTime() - second.date.getTime());
  }, [monthIds, monthlySchedules, specialSchedules, user]);

  const fingerprint = useMemo(() => getFingerprint(assignments), [assignments]);
  const storageKey = user?.id ? `my-schedule-seen:${user.id}` : '';
  const isLoading = loadedMonths.length < monthIds.length;

  useEffect(() => {
    setSeenFingerprint(storageKey ? localStorage.getItem(storageKey) || '' : '');
  }, [storageKey]);

  const markAssignmentsAsSeen = useCallback(() => {
    if (!storageKey || isLoading) return;
    localStorage.setItem(storageKey, fingerprint);
    setSeenFingerprint(fingerprint);
  }, [fingerprint, isLoading, storageKey]);

  const hasUnseenAssignments = !isLoading && assignments.length > 0 && fingerprint !== seenFingerprint;

  return (
    <MyScheduleService.Provider value={{ assignments, isLoading, loadError, hasUnseenAssignments, markAssignmentsAsSeen }}>
      {children}
    </MyScheduleService.Provider>
  );
};
