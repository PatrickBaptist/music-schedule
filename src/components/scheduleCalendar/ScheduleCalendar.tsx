import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheck, FaClock, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import { getMusicianDisplayName, getMusicianPhotoURL, SpecialSchedule } from '../../services/ScheduleService';
import type { User } from '../../services/UsersService';
import Button from '../buttons/Buttons';
import ScheduledPerson, { PersonRef } from '../scheduledPerson/ScheduledPerson';
import {
  AvatarPile, CalendarBody, CalendarDay, CalendarGrid, CalendarModal, CalendarModalHeader,
  CalendarOverlay, CalendarWeekday, CloseButton, EmptyCalendarDay, EventBlock, EventLabels,
  EventActions, ModalScheduleContent, OutfitRow, SelectEventButton, TypeBadge,
} from './ScheduleCalendarStyle';

type RoleKey = 'minister' | 'vocal' | 'teclas' | 'violao' | 'batera' | 'bass' | 'guita' | 'sound';
type Props = {
  schedules: SpecialSchedule[];
  month: number;
  year: number;
  usersById: Record<string, User>;
  selectionMode?: boolean;
  selectedScheduleIds?: string[];
  onToggleSchedule?: (id: string) => void;
  selectedNewDates?: string[];
  onToggleNewDate?: (date: string) => void;
  canDelete?: boolean;
  onDeleteSchedule?: (schedule: SpecialSchedule) => void;
  canEdit?: boolean;
  onEditSchedule?: (schedule: SpecialSchedule) => void;
  onCreateSchedule?: (date: string) => void;
};

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const roles: Array<{ key: RoleKey; label: string }> = [
  { key: 'minister', label: 'Ministro' }, { key: 'vocal', label: 'Vocal' },
  { key: 'teclas', label: 'Teclas' }, { key: 'violao', label: 'Violão' },
  { key: 'batera', label: 'Bateria' }, { key: 'bass', label: 'Baixo' },
  { key: 'guita', label: 'Guitarra' }, { key: 'sound', label: 'Op. Som' },
];

const getPeople = (schedule: SpecialSchedule, role: RoleKey): PersonRef[] => {
  const ids = schedule.músicosIds?.[role] || schedule.musicosIds?.[role] || [];
  if (ids.length) return ids;
  const details = schedule.músicos?.[role] || schedule.musicos?.[role] || [];
  if (details.length) return details;
  if (role === 'vocal') return [schedule.vocal1, schedule.vocal2].filter(Boolean) as string[];
  const legacy = schedule[role];
  return legacy ? [legacy] : [];
};

const getAllPeople = (schedule: SpecialSchedule) => roles.flatMap(({ key }) => getPeople(schedule, key));

const EventDetails = ({ schedule, usersById, selectionMode, selected, onToggle, canDelete, onDelete, canEdit, onEdit }: {
  schedule: SpecialSchedule;
  usersById: Record<string, User>;
  selectionMode: boolean;
  selected: boolean;
  onToggle?: (id: string) => void;
  canDelete: boolean;
  onDelete?: (schedule: SpecialSchedule) => void;
  canEdit: boolean;
  onEdit?: (schedule: SpecialSchedule) => void;
}) => {
  const outfit = schedule.outfitColor || schedule.músicosIds?.outfitColor || schedule.musicosIds?.outfitColor || '';
  return (
    <EventBlock $selected={selected}>
      <header><TypeBadge>Escala</TypeBadge><h3>{schedule.evento}</h3></header>
      <p className="event-time"><FaClock aria-hidden="true" /> {schedule.startTime || 'Horário não definido'}</p>
      {selectionMode && (
        <SelectEventButton type="button" $selected={selected} onClick={() => onToggle?.(schedule.id)}>
          {selected && <FaCheck aria-hidden="true" />}{selected ? 'Selecionada para gerar' : 'Selecionar para geração automática'}
        </SelectEventButton>
      )}
      <ModalScheduleContent>
        {roles.map(({ key, label }) => <p key={key}><strong>{label}:</strong><ScheduledPerson people={getPeople(schedule, key)} usersById={usersById} /></p>)}
        <OutfitRow><strong>Paleta:</strong><span>{outfit || 'Não definida'}</span></OutfitRow>
      </ModalScheduleContent>
      {(canEdit || canDelete) && (
        <EventActions>
          {canEdit && <Button variant="secondary" fullWidth onClick={() => onEdit?.(schedule)}><FaEdit aria-hidden="true" /> Editar escala</Button>}
          {canDelete && <Button variant="danger" fullWidth onClick={() => onDelete?.(schedule)}><FaTrash aria-hidden="true" /> Excluir escala</Button>}
        </EventActions>
      )}
    </EventBlock>
  );
};

const ScheduleCalendar = ({ schedules, month, year, usersById, selectionMode = false, selectedScheduleIds = [], onToggleSchedule, selectedNewDates = [], onToggleNewDate, canDelete = false, onDeleteSchedule, canEdit = false, onEditSchedule, onCreateSchedule }: Props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useBodyScrollLock(Boolean(selectedDate));

  const schedulesByDate = useMemo(() => schedules.reduce<Record<string, SpecialSchedule[]>>((acc, schedule) => {
    const key = schedule.data.slice(0, 10);
    if (!key) return acc;
    (acc[key] ||= []).push(schedule);
    acc[key].sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99') || a.evento.localeCompare(b.evento));
    return acc;
  }, {}), [schedules]);

  useEffect(() => { if (selectedDate) closeRef.current?.focus(); }, [selectedDate]);

  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [...Array.from({ length: firstWeekday }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return (
    <CalendarBody>
      <CalendarGrid>
        {weekDays.map((day) => <CalendarWeekday key={day}>{day}</CalendarWeekday>)}
        {cells.map((day, index) => {
          if (!day) return <EmptyCalendarDay key={`empty-${index}`} />;
          const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const daySchedules = schedulesByDate[key] || [];
          const people = daySchedules.flatMap(getAllPeople);
          const uniquePeople = people.filter((person, personIndex) => {
            const name = getMusicianDisplayName(person, usersById);
            return people.findIndex((candidate) => getMusicianDisplayName(candidate, usersById) === name) === personIndex;
          });
          const selectedCount = daySchedules.filter((schedule) => selectedScheduleIds.includes(schedule.id)).length;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const cellDate = new Date(year, month - 1, day);
          const canSelectNewDate = selectionMode && !daySchedules.length && cellDate >= today;
          const isNewDateSelected = selectedNewDates.includes(key);
          return (
            <CalendarDay
              key={key}
              $hasSchedule={daySchedules.length > 0}
              $hasSelected={selectedCount > 0 || isNewDateSelected}
              $interactive={daySchedules.length > 0 || canSelectNewDate || Boolean(onCreateSchedule && !selectionMode)}
              disabled={!daySchedules.length && !canSelectNewDate && (!onCreateSchedule || selectionMode)}
              aria-pressed={selectionMode && daySchedules.length === 1 ? selectedCount === 1 : undefined}
              aria-label={selectionMode
                ? daySchedules.length === 1
                  ? `${selectedCount ? 'Remover' : 'Selecionar'} escala do dia ${day}`
                  : daySchedules.length > 1
                    ? `Escolher entre ${daySchedules.length} escalas do dia ${day}`
                    : canSelectNewDate
                      ? `${isNewDateSelected ? 'Remover' : 'Selecionar'} nova escala no dia ${day}`
                      : `Nenhuma escala cadastrada no dia ${day}`
                : daySchedules.length
                  ? `Abrir escalas do dia ${day}`
                  : `Criar nova escala no dia ${day}`}
              onClick={() => {
                if (!daySchedules.length) {
                  if (canSelectNewDate) onToggleNewDate?.(key);
                  else if (!selectionMode) onCreateSchedule?.(key);
                  return;
                }
                if (selectionMode && daySchedules.length === 1) {
                  onToggleSchedule?.(daySchedules[0].id);
                  return;
                }
                setSelectedDate(key);
              }}
            >
              <span className="day-number">{day}</span>
              {isNewDateSelected && <EventLabels><span className="selected-events">✓ Nova escala</span></EventLabels>}
              {!!daySchedules.length && <>
                <EventLabels>
                  {daySchedules.slice(0, 2).map((schedule) => (
                    <span key={schedule.id}>
                      {schedule.startTime}
                      {schedule.startTime ? ' · ' : ''}
                      {schedule.evento || 'Escala'}
                    </span>
                  ))}
                  {daySchedules.length > 2 && <span className="more-events">+{daySchedules.length - 2}</span>}
                  {selectedCount > 0 && <span className="selected-events">✓ {selectedCount}</span>}
                </EventLabels>
                <AvatarPile>
                  {uniquePeople.slice(0, 3).map((person, personIndex) => {
                    const name = getMusicianDisplayName(person, usersById);
                    const photo = getMusicianPhotoURL(person, usersById);
                    return <span key={`${name}-${personIndex}`}>{photo ? <img src={photo} alt="" /> : name.charAt(0).toUpperCase()}</span>;
                  })}
                  {uniquePeople.length > 3 && <span className="more">+{uniquePeople.length - 3}</span>}
                </AvatarPile>
              </>}
            </CalendarDay>
          );
        })}
      </CalendarGrid>
      {selectedDate && createPortal(
        <CalendarOverlay onMouseDown={(event) => event.target === event.currentTarget && setSelectedDate(null)}>
          <CalendarModal role="dialog" aria-modal="true" aria-labelledby="schedule-day-title">
            <CalendarModalHeader>
              <div><span>Escalas do dia</span><h2 id="schedule-day-title">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</h2></div>
              <CloseButton ref={closeRef} onClick={() => setSelectedDate(null)} aria-label="Fechar"><FaTimes /></CloseButton>
            </CalendarModalHeader>
            {canEdit && onCreateSchedule && !selectionMode && (
              <Button className="create-for-day" fullWidth onClick={() => { setSelectedDate(null); onCreateSchedule(selectedDate); }}>
                Nova escala neste dia
              </Button>
            )}
            {(schedulesByDate[selectedDate] || []).map((schedule) => <EventDetails key={schedule.id} schedule={schedule} usersById={usersById} selectionMode={selectionMode} selected={selectedScheduleIds.includes(schedule.id)} onToggle={onToggleSchedule} canDelete={canDelete} onDelete={onDeleteSchedule} canEdit={canEdit} onEdit={(item) => { setSelectedDate(null); onEditSchedule?.(item); }} />)}
          </CalendarModal>
        </CalendarOverlay>, document.body
      )}
    </CalendarBody>
  );
};

export default ScheduleCalendar;
