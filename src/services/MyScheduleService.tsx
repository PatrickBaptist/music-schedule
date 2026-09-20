import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import useAuthContext from '../context/hooks/useAuthContext';
import useSchedulesContext from '../context/hooks/useScheduleContext';
import useMusicLinksContext from '../context/hooks/useMusicLinksContext';
import type { MusicLink } from './MusicLinksService';
import { getWorshipMomentPosition } from '../constants/worshipMoments';
import { MusicoDetalhe, SpecialSchedule } from './ScheduleService';

type RoleKey = 'minister' | 'vocal' | 'teclas' | 'violao' | 'batera' | 'bass' | 'guita' | 'sound';
type LoggedUser = { id: string; name?: string; nickname?: string };

export type PersonalAssignment = {
  id: string;
  date: Date;
  startTime?: string | null;
  title: string;
  type: 'Escala';
  roles: string[];
  outfitColor: string;
  musicLinks: MusicLink[];
};

type ContextProps = {
  assignments: PersonalAssignment[];
  isLoading: boolean;
  loadError: boolean;
  hasUnseenAssignments: boolean;
  markAssignmentsAsSeen: () => void;
};

export const MyScheduleService = createContext<ContextProps | undefined>(undefined);
const roleLabels: Array<{ key: RoleKey; label: string }> = [
  { key: 'minister', label: 'Ministro' }, { key: 'vocal', label: 'Vocal' },
  { key: 'teclas', label: 'Teclado' }, { key: 'violao', label: 'Violão' },
  { key: 'batera', label: 'Bateria' }, { key: 'bass', label: 'Baixo' },
  { key: 'guita', label: 'Guitarra' }, { key: 'sound', label: 'Operador de som' },
];

const normalize = (value?: string | null) => value?.trim().toLocaleLowerCase('pt-BR') || '';
const isCurrentUser = (reference: string | MusicoDetalhe, user: LoggedUser) => {
  const own = [user.id, user.nickname, user.name].map(normalize).filter(Boolean);
  if (typeof reference === 'string') return own.includes(normalize(reference));
  return [reference.id, reference.nickname, reference.name, reference.label].map(normalize).some((value) => own.includes(value));
};
const legacyPeople = (schedule: SpecialSchedule, key: RoleKey) => key === 'vocal'
  ? [schedule.vocal1, schedule.vocal2].filter((value): value is string => Boolean(value))
  : schedule[key] ? [schedule[key] as string] : [];
const getRoles = (schedule: SpecialSchedule, user: LoggedUser) => roleLabels.filter(({ key }) => [
  ...(schedule.músicosIds?.[key] || []), ...(schedule.musicosIds?.[key] || []),
  ...(schedule.músicos?.[key] || []), ...(schedule.musicos?.[key] || []), ...legacyPeople(schedule, key),
].some((reference) => isCurrentUser(reference, user))).map(({ label }) => label);
const parseDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
};
const fingerprint = (assignments: PersonalAssignment[]) => JSON.stringify(assignments.map(({ id, date, startTime, roles, outfitColor, musicLinks }) => ({
  id,
  date: date.toISOString(),
  startTime,
  roles,
  outfitColor,
  musicLinks: musicLinks.map((music) => ({ id: music.id, order: music.order, worshipMoment: music.worshipMoment })),
})));

export const MyScheduleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const { specialSchedules } = useSchedulesContext();
  const { musicLinks } = useMusicLinksContext();
  const [seenFingerprint, setSeenFingerprint] = useState('');
  const assignments = useMemo(() => {
    if (!user) return [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return (specialSchedules || []).map((schedule): PersonalAssignment | null => {
      const roles = getRoles(schedule, user);
      const date = parseDate(schedule.data);
      if (!roles.length || Number.isNaN(date.getTime()) || date < today) return null;
      const scheduleDate = schedule.data.slice(0, 10);
      return {
        id: schedule.id,
        date,
        startTime: schedule.startTime,
        title: schedule.evento,
        type: 'Escala',
        roles,
        outfitColor: schedule.outfitColor || schedule.músicosIds?.outfitColor || schedule.musicosIds?.outfitColor || '',
        musicLinks: musicLinks
          .filter((music) => music.scheduleDate?.slice(0, 10) === scheduleDate)
          .sort((a, b) =>
            getWorshipMomentPosition(a.worshipMoment) - getWorshipMomentPosition(b.worshipMoment)
            || (a.order || 0) - (b.order || 0)
          ),
      };
    }).filter((item): item is PersonalAssignment => Boolean(item))
      .sort((a, b) => a.date.getTime() - b.date.getTime() || (a.startTime || '99:99').localeCompare(b.startTime || '99:99'));
  }, [musicLinks, specialSchedules, user]);

  const currentFingerprint = useMemo(() => fingerprint(assignments), [assignments]);
  const storageKey = user?.id ? `my-schedule-seen:${user.id}` : '';
  const savedFingerprint = seenFingerprint || (storageKey ? localStorage.getItem(storageKey) || '' : '');
  const markAssignmentsAsSeen = useCallback(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, currentFingerprint);
    setSeenFingerprint(currentFingerprint);
  }, [currentFingerprint, storageKey]);

  return <MyScheduleService.Provider value={{ assignments, isLoading: false, loadError: false, hasUnseenAssignments: assignments.length > 0 && currentFingerprint !== savedFingerprint, markAssignmentsAsSeen }}>{children}</MyScheduleService.Provider>;
};
