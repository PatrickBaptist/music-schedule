import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaMagic, FaThLarge } from 'react-icons/fa';
import { toast } from 'sonner';
import useAuthContext from '../../context/hooks/useAuthContext';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import useUsersContext from '../../context/hooks/useUsersContext';
import type { MusicoDetalhe, SpecialSchedule } from '../../services/ScheduleService';
import type { User } from '../../services/UsersService';
import { UserRole } from '../../types/UserRole';
import Button, { MotionButton } from '../buttons/Buttons';
import EspecialScheduleInput from '../especialScheduleInput/EspecialScheduleInput';
import LoadingScreen from '../loading/LoadingScreen';
import PageWrapper from '../pageWrapper/pageWrapper';
import ScheduleCalendar from '../scheduleCalendar/ScheduleCalendar';
import ScheduledPerson, { PersonRef } from '../scheduledPerson/ScheduledPerson';
import { AddFormOverlay, CardsGrid, GenerationPanel, MonthNavigation, ScheduleContainer, ScheduleContent, SeeScale, ViewToggle } from './ScheduleStyle';

type RoleKey = 'minister' | 'vocal' | 'teclas' | 'violao' | 'batera' | 'bass' | 'guita' | 'sound';
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
  if (details.length) return details as MusicoDetalhe[];
  if (role === 'vocal') return [schedule.vocal1, schedule.vocal2].filter(Boolean) as string[];
  return schedule[role] ? [schedule[role] as string] : [];
};

const Schedule = () => {
  const { specialSchedules, getSpecialSchedules, generateSelectedSchedules, deleteSpecialSchedules } = useSchedulesContext();
  const { user } = useAuthContext();
  const { users } = useUsersContext();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<SpecialSchedule | null>(null);
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('calendar');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [generationMode, setGenerationMode] = useState<'fill-empty' | 'replace'>('fill-empty');

  useBodyScrollLock(isModalOpen);
  const canManage = (user?.roles || []).some((role) => [UserRole.Leader, UserRole.Admin].includes(role as UserRole));
  const usersById = useMemo(() => users.reduce<Record<string, User>>((acc, current) => ({ ...acc, [current.id]: current }), {}), [users]);
  const month = visibleMonth.getMonth() + 1;
  const year = visibleMonth.getFullYear();
  const monthTitle = visibleMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  useEffect(() => {
    setLoading(true);
    getSpecialSchedules().catch(() => toast.error('Não foi possível carregar as escalas.')).finally(() => setLoading(false));
  }, [getSpecialSchedules]);

  const monthSchedules = useMemo(() => (specialSchedules || [])
    .filter((schedule) => {
      const [scheduleYear, scheduleMonth] = schedule.data.slice(0, 10).split('-').map(Number);
      return scheduleYear === year && scheduleMonth === month;
    })
    .sort((a, b) => a.data.localeCompare(b.data) || (a.startTime || '99:99').localeCompare(b.startTime || '99:99')),
  [specialSchedules, month, year]);

  const changeMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedIds([]);
    setSelectedDates([]);
  };
  const toggleSelected = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSelectedDate = (date: string) => setSelectedDates((current) => current.includes(date) ? current.filter((item) => item !== date) : [...current, date].sort());
  const cancelSelection = () => { setIsSelecting(false); setSelectedIds([]); setSelectedDates([]); };

  const generate = async () => {
    if ((!selectedIds.length && !selectedDates.length) || isGenerating) return;
    const toastId = toast.loading('Gerando as equipes selecionadas...');
    setIsGenerating(true);
    try {
      await generateSelectedSchedules({ scheduleIds: selectedIds, dates: selectedDates, mode: generationMode });
      toast.success('Equipes geradas com sucesso.', { id: toastId });
      cancelSelection();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível gerar as equipes.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmGeneration = () => {
    const totalSelected = selectedIds.length + selectedDates.length;
    if (!totalSelected) return toast.error('Selecione pelo menos uma escala ou uma data vazia.');
    toast(`Gerar ${totalSelected} escala${totalSelected > 1 ? 's' : ''}?`, {
      description: generationMode === 'fill-empty' ? 'As funções preenchidas serão mantidas.' : 'As equipes atuais serão substituídas.',
      action: { label: 'Confirmar', onClick: () => void generate() },
    });
  };

  const confirmDelete = (schedule: SpecialSchedule) => {
    toast('Excluir esta escala?', {
      description: `${new Date(`${schedule.data.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')}${schedule.startTime ? ` às ${schedule.startTime}` : ''}. Esta ação não pode ser desfeita.`,
      action: {
        label: 'Excluir',
        onClick: async () => {
          const toastId = toast.loading('Excluindo escala...');
          try {
            await deleteSpecialSchedules(schedule.id);
            setSelectedIds((current) => current.filter((id) => id !== schedule.id));
            toast.success('Escala excluída.', { id: toastId });
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível excluir a escala.', { id: toastId });
          }
        },
      },
    });
  };

  return (
    <ScheduleContainer><PageWrapper><ScheduleContent>
      <h1>Escalas</h1>
      <MonthNavigation>
        <Button variant="ghost" size="sm" onClick={() => changeMonth(-1)} aria-label="Mês anterior"><FaChevronLeft /></Button>
        <strong>{monthTitle}</strong>
        <Button variant="ghost" size="sm" onClick={() => changeMonth(1)} aria-label="Próximo mês"><FaChevronRight /></Button>
      </MonthNavigation>

      {canManage && <div className="add-schedule">
        <h4>Gerar automaticamente</h4><MotionButton variant="unstyled" className="btns generate-btn" onClick={() => { setViewMode('calendar'); setIsSelecting(true); setSelectedIds([]); setSelectedDates([]); }}><FaMagic size={12} /></MotionButton>
      </div>}

      <ViewToggle role="group" aria-label="Escolher visualização">
        <Button variant="tab" size="sm" className={viewMode === 'cards' ? 'active' : ''} aria-pressed={viewMode === 'cards'} onClick={() => { setViewMode('cards'); cancelSelection(); }}><FaThLarge /> Cartões</Button>
        <Button variant="tab" size="sm" className={viewMode === 'calendar' ? 'active' : ''} aria-pressed={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}><FaCalendarAlt /> Calendário</Button>
      </ViewToggle>

      {canManage && isSelecting && <GenerationPanel>
        <div><strong>Selecione as escalas ou novas datas</strong><span>Um dia vazio cria uma escala. Quando já houver escalas no dia, a seleção será feita pelo card.</span></div>
        <label>Como gerar<select value={generationMode} onChange={(event) => setGenerationMode(event.target.value as 'fill-empty' | 'replace')}><option value="fill-empty">Preencher funções vazias</option><option value="replace">Substituir toda a equipe</option></select></label>
        <div className="generation-actions"><Button variant="ghost" onClick={cancelSelection}>Cancelar</Button><Button onClick={confirmGeneration} disabled={selectedIds.length + selectedDates.length === 0 || isGenerating}><FaMagic /> Gerar ({selectedIds.length + selectedDates.length})</Button></div>
      </GenerationPanel>}

      {isModalOpen && createPortal(<AddFormOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }}><EspecialScheduleInput setIsModalOpen={setIsModalOpen} initialSchedule={editingSchedule} initialDate={newScheduleDate} /></AddFormOverlay>, document.body)}

      {loading ? <LoadingScreen /> : viewMode === 'calendar' ? (
        <ScheduleCalendar schedules={monthSchedules} month={month} year={year} usersById={usersById} selectionMode={canManage && isSelecting} selectedScheduleIds={selectedIds} onToggleSchedule={toggleSelected} selectedNewDates={selectedDates} onToggleNewDate={toggleSelectedDate} canDelete={canManage} onDeleteSchedule={confirmDelete} canEdit={canManage} onEditSchedule={(schedule) => { setNewScheduleDate(''); setEditingSchedule(schedule); setIsModalOpen(true); }} onCreateSchedule={canManage ? (date) => { setEditingSchedule(null); setNewScheduleDate(date); setIsModalOpen(true); } : undefined} />
      ) : monthSchedules.length ? (
        <CardsGrid>{monthSchedules.map((schedule) => <SeeScale key={schedule.id}>
          <h3>{schedule.evento}</h3>
          <p className="schedule-meta">{new Date(`${schedule.data.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')} · <FaClock /> {schedule.startTime || 'Horário não definido'}</p>
          <div className="content-escala">{roles.map(({ key, label }) => <p key={key}><strong>{label}:</strong><ScheduledPerson people={getPeople(schedule, key)} usersById={usersById} /></p>)}</div>
        </SeeScale>)}</CardsGrid>
      ) : <p>Nenhuma escala cadastrada neste mês.</p>}
    </ScheduleContent></PageWrapper></ScheduleContainer>
  );
};

export default Schedule;
