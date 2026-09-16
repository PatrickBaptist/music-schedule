import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import {
  getMusicianDisplayName,
  getMusicianPhotoURL,
  Schedule,
  SpecialSchedule,
} from '../../services/ScheduleService';
import type { User } from '../../services/UsersService';
import { UserRole } from '../../types/UserRole';
import ScheduledPerson, { PersonRef } from '../scheduledPerson/ScheduledPerson';
import {
  AvatarPile,
  CalendarBody,
  CalendarDay,
  CalendarGrid,
  CalendarModal,
  CalendarModalHeader,
  CalendarOverlay,
  CalendarWeekday,
  CloseButton,
  EmptyCalendarDay,
  EventBlock,
  EventLabels,
  FilterBar,
  ModalScheduleContent,
  OutfitRow,
  PredictionLabel,
  TypeBadge,
} from './ScheduleCalendarStyle';

type RoleKey = 'minister' | 'vocal' | 'teclas' | 'violao' | 'batera' | 'bass' | 'guita' | 'sound';
type EventType = 'sunday' | 'thursday' | 'special';

type SundayEvent = {
  id: string;
  dateKey: string;
  type: 'sunday';
  title: string;
  schedule: Schedule;
};

type ThursdayEvent = {
  id: string;
  dateKey: string;
  type: 'thursday';
  title: string;
  ministerId: string;
};

type SpecialEvent = {
  id: string;
  dateKey: string;
  type: 'special';
  title: string;
  schedule: SpecialSchedule;
};

type CalendarEvent = SundayEvent | ThursdayEvent | SpecialEvent;

type ScheduleCalendarProps = {
  schedules: Schedule[];
  specialSchedules: SpecialSchedule[];
  month: number;
  year: number;
  users: User[];
  usersById: Record<string, User>;
  nextSundayDate?: string;
};

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const roles: Array<{ key: RoleKey; label: string }> = [
  { key: 'minister', label: 'Ministro' },
  { key: 'vocal', label: 'Vocal' },
  { key: 'teclas', label: 'Teclas' },
  { key: 'violao', label: 'Violão' },
  { key: 'batera', label: 'Batera' },
  { key: 'bass', label: 'Bass' },
  { key: 'guita', label: 'Guita' },
  { key: 'sound', label: 'Op. Som' },
];

const typeLabels: Record<EventType, string> = {
  sunday: 'Domingo',
  thursday: 'Quinta',
  special: 'Especial',
};

const parseScheduleDate = (value: string) => {
  const [dateOnly] = value.split('T');
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getSundayPeople = (schedule: Schedule, role: RoleKey): PersonRef[] => (
  schedule.músicosIds[role].length > 0 ? schedule.músicosIds[role] : schedule.músicos[role]
);

const getSpecialPeople = (schedule: SpecialSchedule, role: RoleKey): PersonRef[] => {
  const idPeople = schedule.músicosIds?.[role] || schedule.musicosIds?.[role] || [];
  if (idPeople.length > 0) return idPeople;

  const detailedPeople = schedule.músicos?.[role] || schedule.musicos?.[role] || [];
  if (detailedPeople.length > 0) return detailedPeople;

  if (role === 'vocal') return [schedule.vocal1, schedule.vocal2].filter(Boolean) as string[];
  const legacyPerson = schedule[role];
  return legacyPerson ? [legacyPerson] : [];
};

const getEventPeople = (event: CalendarEvent) => {
  if (event.type === 'thursday') return [event.ministerId];
  if (event.type === 'sunday') return roles.flatMap(({ key }) => getSundayPeople(event.schedule, key));
  return roles.flatMap(({ key }) => getSpecialPeople(event.schedule, key));
};

const getThursdays = (month: number, year: number, users: User[]): ThursdayEvent[] => {
  const ministers = users.filter((user) => user.roles.includes(UserRole.Minister) && user.status === 'enabled');
  if (ministers.length === 0) return [];

  let previousThursdays = 0;
  for (let previousMonth = 1; previousMonth < month; previousMonth += 1) {
    const daysInPreviousMonth = new Date(year, previousMonth, 0).getDate();
    for (let day = 1; day <= daysInPreviousMonth; day += 1) {
      if (new Date(year, previousMonth - 1, day).getDay() === 4) previousThursdays += 1;
    }
  }

  const events: ThursdayEvent[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month - 1, day);
    if (date.getDay() !== 4) continue;

    const minister = ministers[(previousThursdays + events.length) % ministers.length];
    const dateKey = formatDateKey(date);
    events.push({
      id: `thursday-${dateKey}`,
      dateKey,
      type: 'thursday',
      title: 'Culto de quinta-feira',
      ministerId: minister.id,
    });
  }

  return events;
};

const EventDetails = ({ event, usersById }: { event: CalendarEvent; usersById: Record<string, User> }) => {
  if (event.type === 'thursday') {
    return (
      <EventBlock>
        <header><TypeBadge $type="thursday">Quinta-feira</TypeBadge><h3>{event.title}</h3></header>
        <PredictionLabel>Previsão automática — ainda não salva</PredictionLabel>
        <ModalScheduleContent>
          <p><strong>Ministro:</strong><ScheduledPerson people={event.ministerId} usersById={usersById} /></p>
        </ModalScheduleContent>
      </EventBlock>
    );
  }

  const isSunday = event.type === 'sunday';
  const outfitColor = isSunday
    ? event.schedule.músicosIds.outfitColor || event.schedule.músicos.outfitColor
    : event.schedule.outfitColor || event.schedule.músicosIds?.outfitColor || event.schedule.musicosIds?.outfitColor || event.schedule.músicos?.outfitColor || event.schedule.musicos?.outfitColor;

  return (
    <EventBlock>
      <header><TypeBadge $type={event.type}>{typeLabels[event.type]}</TypeBadge><h3>{event.title}</h3></header>
      <ModalScheduleContent>
        {roles.map(({ key, label }) => (
          <p key={key}>
            <strong>{label}:</strong>
            <ScheduledPerson
              people={isSunday ? getSundayPeople(event.schedule, key) : getSpecialPeople(event.schedule, key)}
              usersById={usersById}
            />
          </p>
        ))}
        <OutfitRow><strong>Paleta:</strong><span>{outfitColor || 'Não definida'}</span></OutfitRow>
      </ModalScheduleContent>
    </EventBlock>
  );
};

const ScheduleDetails = ({
  dateKey,
  events,
  usersById,
  onClose,
}: {
  dateKey: string;
  events: CalendarEvent[];
  usersById: Record<string, User>;
  onClose: () => void;
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const date = parseScheduleDate(dateKey);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <CalendarOverlay onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <CalendarModal role="dialog" aria-modal="true" aria-labelledby="calendar-schedule-title">
        <CalendarModalHeader>
          <div>
            <span>{events.length > 1 ? `${events.length} eventos no dia` : 'Evento do dia'}</span>
            <h2 id="calendar-schedule-title">
              {date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </h2>
          </div>
          <CloseButton ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar detalhes da escala">
            <FaTimes aria-hidden="true" />
          </CloseButton>
        </CalendarModalHeader>

        {events.map((event) => <EventDetails key={event.id} event={event} usersById={usersById} />)}
      </CalendarModal>
    </CalendarOverlay>,
    document.body
  );
};

const ScheduleCalendar = ({
  schedules,
  specialSchedules,
  month,
  year,
  users,
  usersById,
  nextSundayDate,
}: ScheduleCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visibleTypes, setVisibleTypes] = useState<Record<EventType, boolean>>({ sunday: true, thursday: true, special: true });
  useBodyScrollLock(Boolean(selectedDate));

  const allEvents = useMemo<CalendarEvent[]>(() => {
    const sundayEvents: SundayEvent[] = schedules.map((schedule) => ({
      id: `sunday-${schedule.date}`,
      dateKey: formatDateKey(parseScheduleDate(schedule.date)),
      type: 'sunday',
      title: 'Culto de domingo',
      schedule,
    }));

    const specialEvents: SpecialEvent[] = specialSchedules
      .filter((schedule) => {
        const date = parseScheduleDate(schedule.data);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      })
      .map((schedule) => ({
        id: `special-${schedule.id || schedule.data}-${schedule.evento}`,
        dateKey: formatDateKey(parseScheduleDate(schedule.data)),
        type: 'special',
        title: schedule.evento || 'Evento especial',
        schedule,
      }));

    return [...sundayEvents, ...getThursdays(month, year, users), ...specialEvents];
  }, [month, schedules, specialSchedules, users, year]);

  const eventsByDate = useMemo(() => allEvents.reduce<Record<string, CalendarEvent[]>>((result, event) => {
    if (!visibleTypes[event.type]) return result;
    result[event.dateKey] = [...(result[event.dateKey] || []), event];
    return result;
  }, {}), [allEvents, visibleTypes]);

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month - 1, index + 1)),
    ];
  }, [month, year]);

  const toggleType = (type: EventType) => {
    setVisibleTypes((current) => ({ ...current, [type]: !current[type] }));
  };

  return (
    <CalendarBody>
      <FilterBar aria-label="Filtrar tipos de escala">
        {(Object.keys(typeLabels) as EventType[]).map((type) => (
          <button key={type} type="button" aria-pressed={visibleTypes[type]} onClick={() => toggleType(type)}>
            <i className={type} aria-hidden="true" /> {typeLabels[type]}
          </button>
        ))}
      </FilterBar>

      <CalendarGrid role="grid" aria-label={`Calendário de ${month}/${year}`}>
        {weekDays.map((day) => <CalendarWeekday key={day} role="columnheader">{day}</CalendarWeekday>)}

        {cells.map((date, index) => {
          if (!date) return <EmptyCalendarDay key={`empty-${index}`} aria-hidden="true" />;

          const dateKey = formatDateKey(date);
          const events = eventsByDate[dateKey] || [];
          const people = events.flatMap(getEventPeople);
          const uniquePeople = people.filter((person, personIndex) => {
            const reference = typeof person === 'string' ? person : person?.id;
            return people.findIndex((candidate) => (typeof candidate === 'string' ? candidate : candidate?.id) === reference) === personIndex;
          });

          return (
            <CalendarDay
              key={dateKey}
              type="button"
              role="gridcell"
              $hasSchedule={events.length > 0}
              $isNextSunday={dateKey === nextSundayDate}
              disabled={events.length === 0}
              onClick={() => events.length > 0 && setSelectedDate(dateKey)}
              aria-label={events.length > 0 ? `Abrir ${events.length} evento(s) de ${date.toLocaleDateString('pt-BR')}` : date.toLocaleDateString('pt-BR')}
            >
              <span className="day-number">{date.getDate()}</span>
              {events.length > 0 && (
                <>
                  <EventLabels>
                    {events.slice(0, 2).map((event) => <span key={event.id} className={event.type}>{typeLabels[event.type]}</span>)}
                    {events.length > 2 && <span className="more-events">+{events.length - 2}</span>}
                  </EventLabels>
                  <AvatarPile aria-label={`${uniquePeople.length} pessoas escaladas`}>
                    {uniquePeople.slice(0, 3).map((person, personIndex) => {
                      const name = getMusicianDisplayName(person, usersById);
                      const photoURL = getMusicianPhotoURL(person, usersById);
                      return (
                        <span key={`${name}-${personIndex}`} title={name}>
                          {photoURL ? <img src={photoURL} alt="" /> : name.charAt(0).toUpperCase() || '?'}
                        </span>
                      );
                    })}
                    {uniquePeople.length > 3 && <span className="more">+{uniquePeople.length - 3}</span>}
                  </AvatarPile>
                </>
              )}
            </CalendarDay>
          );
        })}
      </CalendarGrid>

      {selectedDate && (
        <ScheduleDetails
          dateKey={selectedDate}
          events={eventsByDate[selectedDate] || []}
          usersById={usersById}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </CalendarBody>
  );
};

export default ScheduleCalendar;
