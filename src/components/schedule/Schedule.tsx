import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { AddFormOverlay, CardsGrid, ScheduleContainer, ScheduleContent, SeeScale } from './ScheduleStyle';
import LoadingScreen from '../loading/LoadingScreen';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import { toast } from 'sonner';
import PageWrapper from '../pageWrapper/pageWrapper';
import { FaMagic, FaPlus } from 'react-icons/fa';
import ScheduleInput from '../scheduleInput/ScheduleInput';
import { UserRole } from '../../types/UserRole';
import useAuthContext from '../../context/hooks/useAuthContext';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import useUsersContext from '../../context/hooks/useUsersContext';
import type { User } from '../../services/UsersService';
import {
  getMusicianDisplayName,
  getMusicianPhotoURL,
  MusicoDetalhe,
} from '../../services/ScheduleService';

const getTargetMonthAndYear = () => {
  const today = new Date();

  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7 || 7));

  const nextSundayMonth = nextSunday.getMonth() + 1;
  const nextSundayYear = nextSunday.getFullYear();

  return {
    targetMonth: nextSundayMonth,
    targetYear: nextSundayYear,
  };
};

const getFormattedMonth = (): string => {
  const { targetMonth, targetYear } = getTargetMonthAndYear();
  const formattedMonth = targetMonth.toString().padStart(2, '0');
  return `${formattedMonth}-${targetYear}`;
};

const getNameMonth = (): string => {
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const { targetMonth } = getTargetMonthAndYear();
  return monthNames[targetMonth - 1];
};

const parseScheduleDate = (date: string | Date): Date => {
  if (date instanceof Date) return date;

  const [dateOnly] = date.split('T');
  const parts = dateOnly.split('-').map((value) => parseInt(value, 10));

  if (parts.length === 3 && parts.every((value) => !Number.isNaN(value))) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  return new Date(date);
};

const formatDateToYYYYMMDD = (date: string | Date): string => {
  const d = parseScheduleDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatScheduleDate = (date: string | Date): string => {
  return parseScheduleDate(date).toLocaleDateString('pt-BR');
};

type PersonRef = string | MusicoDetalhe | null | undefined;

const PersonBadge = ({
  person,
  usersById,
}: {
  person: PersonRef;
  usersById: Record<string, User>;
}) => {
  const displayName = getMusicianDisplayName(person, usersById);
  const photoURL = getMusicianPhotoURL(person, usersById);

  if (!person) {
    return <span style={{ color: '#9ca3af' }}>Não definido</span>;
  }

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'flex-end',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#1f2937',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '0.72rem',
          fontWeight: 700,
        }}
      >
        {photoURL ? <img src={photoURL} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials || '?'}
      </span>
      <span style={{ textAlign: 'right' }}>{displayName}</span>
    </span>
  );
};

const PersonList = ({
  people,
  usersById,
}: {
  people: PersonRef[] | PersonRef;
  usersById: Record<string, User>;
}) => {
  const list = Array.isArray(people) ? people : [people];
  const validPeople = list.filter(Boolean);

  if (validPeople.length === 0) {
    return <span style={{ color: '#9ca3af' }}>Não definido</span>;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        justifyContent: 'flex-end',
        maxWidth: 'calc(100% - 90px)',
      }}
    >
      {validPeople.map((person, index) => (
        <PersonBadge key={`${typeof person === 'string' ? person : person?.id}-${index}`} person={person} usersById={usersById} />
      ))}
    </span>
  );
};

const Schedule: React.FC = () => {
  const { monthlySchedule, getScheduleForMonth, nextSundaySchedule, generateMonthlySchedule } = useSchedulesContext();
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: loggedUser } = useAuthContext();
  const { users } = useUsersContext();

  const currentMonth = getFormattedMonth();
  const nameMonth = getNameMonth();
  const usersById = useMemo(
    () => users.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {}),
    [users]
  );

  const loggedRoles = loggedUser?.roles || [];
  const allowedRoles = [UserRole.Leader, UserRole.Admin];
  const canManageSchedule = loggedRoles.some((role) => allowedRoles.includes(role as UserRole));

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        await getScheduleForMonth(currentMonth);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (!err.message.includes('404')) {
            toast.error('Erro ao buscar escala: ' + err.message);
          }
        } else {
          toast.error('Erro desconhecido ao buscar escala');
        }
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [getScheduleForMonth, currentMonth]);

  const executeGenerateMonthlySchedule = async () => {
    const [month, year] = currentMonth.split('-').map((value) => parseInt(value, 10));

    const toastId = toast.loading('Chamando escala automática...');
    setIsGenerating(true);
    try {
      await generateMonthlySchedule({ month, year });
      getScheduleForMonth(currentMonth);
      toast.success('Escala automática criada com sucesso', { id: toastId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Não foi possível gerar a escala automática';
      toast.error(message, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMonthlySchedule = () => {
    if (isGenerating) return;

    toast('Confirmar geração automática?', {
      description: 'Clique em "Confirmar" para gerar a escala do mês atual.',
      action: {
        label: 'Confirmar',
        onClick: () => {
          void executeGenerateMonthlySchedule();
        },
      },
    });
  };

  const isNextSunday = (dateString: string) => {
    if (!nextSundaySchedule) return false;
    return formatDateToYYYYMMDD(dateString) === nextSundaySchedule.date;
  };

  return (
    <ScheduleContainer>
      <PageWrapper>
        <ScheduleContent>
          <h1>Escala de {nameMonth}</h1>

          {canManageSchedule && (
            <div className="add-schedule">
              <h4>Adicionar escala</h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btns add-btn"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus size={12} />
              </motion.button>

              <h4>Gerar automático</h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btns generate-btn"
                onClick={handleGenerateMonthlySchedule}
                disabled={isGenerating}
              >
                <FaMagic size={12} />
              </motion.button>
            </div>
          )}

          {isModalOpen &&
            createPortal(
              <AddFormOverlay
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              >
                <ScheduleInput setIsModalOpen={setIsModalOpen} />
              </AddFormOverlay>,
              document.body
            )}

          {loading ? (
            <LoadingScreen />
          ) : monthlySchedule && monthlySchedule.length > 0 ? (
            <CardsGrid>
              {monthlySchedule
                .slice()
                .sort((a, b) => parseScheduleDate(a.date).getTime() - parseScheduleDate(b.date).getTime())
                .map((musician, index) => (
                  <SeeScale key={index}>
                    <h3 style={{ color: isNextSunday(musician.date) ? 'red' : '#2EBEF2' }}>
                      {formatScheduleDate(musician.date)}
                    </h3>
                    <div className="content-escala">
                      <p style={{ fontWeight: '500', color: '#f59e0b' }}>
                        <strong>Ministro: </strong>
                        <PersonBadge person={musician.músicosIds.minister || musician.músicos.minister} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Vocal: </strong>
                        <PersonList people={musician.músicosIds.vocal.length > 0 ? musician.músicosIds.vocal : musician.músicos.vocal} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Teclas: </strong>
                        <PersonBadge person={musician.músicosIds.teclas || musician.músicos.teclas} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Violão: </strong>
                        <PersonBadge person={musician.músicosIds.violao || musician.músicos.violao} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Batera: </strong>
                        <PersonBadge person={musician.músicosIds.batera || musician.músicos.batera} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Bass: </strong>
                        <PersonBadge person={musician.músicosIds.bass || musician.músicos.bass} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Guita: </strong>
                        <PersonBadge person={musician.músicosIds.guita || musician.músicos.guita} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Op. Som: </strong>
                        <PersonBadge person={musician.músicosIds.sound || musician.músicos.sound} usersById={usersById} />
                      </p>
                    </div>
                  </SeeScale>
                ))}
            </CardsGrid>
          ) : (
            <p>Nenhuma escala disponível para este mês</p>
          )}
        </ScheduleContent>
      </PageWrapper>
    </ScheduleContainer>
  );
};

export default Schedule;
