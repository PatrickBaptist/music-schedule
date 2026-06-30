import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import MusicLinkInput from '../../components/musicLink/MusicLinkInput';
import MusicLinkList from '../../components/musicList/MusicLinkList';
import { AddFormOverlay, Container, ContainerHome } from './HomePageStyle';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import LoadingScreen from '../../components/loading/LoadingScreen';
import PageWrapper from '../../components/pageWrapper/pageWrapper';
import Aviso from '../../components/warnings/warnings';
import SpecialSchedules from '../../components/specialSchedule/specialSchedule';
import useNotificationContext from '../../context/hooks/useNotificationContext';
import { MusicoDetalhe, SpecialSchedule, getMusicianDisplayName, getMusicianPhotoURL } from '../../services/ScheduleService';
import ThursdaySchedule from '../../components/thursdaySchedule/thursday';
import BirthdaysThisMonth from '../../components/birthdaysMonth/birthdaysMonth';
import { FaPlus } from 'react-icons/fa';
import useAuthContext from '../../context/hooks/useAuthContext';
import { UserRole } from '../../types/UserRole';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import useUsersContext from '../../context/hooks/useUsersContext';
import type { User } from '../../services/UsersService';

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

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { nextSundaySchedule, specialSchedules, getSpecialSchedules } = useSchedulesContext();
  const { warning, getWarning } = useNotificationContext();
  const [isLoading, setIsLoading] = useState(true);
  const { user: loggedUser } = useAuthContext();
  const { users } = useUsersContext();

  const isGuest = loggedUser?.roles?.includes(UserRole.Guest);

  const loggedRoles = loggedUser?.roles || [];
  const allowedRoles = [UserRole.Leader, UserRole.Minister, UserRole.Admin, UserRole.Vocal];
  const canAddMusic = loggedRoles.some((role) => allowedRoles.includes(role as UserRole));
  const usersById = useMemo(
    () => users.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {}),
    [users]
  );

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getWarning(), getSpecialSchedules()]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getWarning, getSpecialSchedules]);

  return (
    <Container>
      <ContainerHome>
        <PageWrapper>
          {warning?.text && <Aviso message={'⚠️ ' + warning.text} duration={20000} />}

          <div className="desktop-layout">
            <div className="coluna-1">
              {canAddMusic && (
                <div className="content-louvores">
                  <h4>Adicionar louvor</h4>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btns add-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaPlus size={12} />
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
                    <MusicLinkInput setIsModalOpen={setIsModalOpen} />
                  </AddFormOverlay>,
                  document.body
                )}

              <MusicLinkList canDelete={loggedRoles} />
            </div>

            <div className="coluna-2">
              <div className="container-escala">
                <h4>Escala do próximo domingo</h4>
                <div className="content">
                  {isLoading ? (
                    <LoadingScreen />
                  ) : nextSundaySchedule ? (
                    <div className="content-escala">
                      <p style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                        <strong>Ministro: </strong>
                        <PersonBadge person={nextSundaySchedule.músicosIds.minister || nextSundaySchedule.músicos.minister} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Vocal: </strong>
                        <PersonList people={nextSundaySchedule.músicosIds.vocal.length > 0 ? nextSundaySchedule.músicosIds.vocal : nextSundaySchedule.músicos.vocal} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Teclas: </strong>
                        <PersonBadge person={nextSundaySchedule.músicosIds.teclas || nextSundaySchedule.músicos.teclas} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Violão: </strong>
                        <PersonBadge person={nextSundaySchedule.músicosIds.violao || nextSundaySchedule.músicos.violao} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Batera: </strong>
                        <PersonBadge person={nextSundaySchedule.músicosIds.batera || nextSundaySchedule.músicos.batera} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Bass: </strong>
                        <PersonBadge person={nextSundaySchedule.músicosIds.bass || nextSundaySchedule.músicos.bass} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Guita: </strong>
                        <PersonBadge person={nextSundaySchedule.músicosIds.guita || nextSundaySchedule.músicos.guita} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Op. Som: </strong>
                        <PersonBadge person={nextSundaySchedule.músicosIds.sound || nextSundaySchedule.músicos.sound} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Paleta de cores: </strong>
                        <span style={{ fontStyle: 'italic' }}>{nextSundaySchedule.músicos.outfitColor || 'Não definido'}</span>
                      </p>
                    </div>
                  ) : (
                    <p>Não há escala disponível</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="desktop-layout-row-2">
            <div className="coluna-1">
              {specialSchedules && <SpecialSchedules usersRoles={loggedRoles} schedules={specialSchedules as SpecialSchedule[]} loading={isLoading} />}
            </div>
            <div className="coluna-2">
              <div className="container-escala2">
                <h4>Escala de ministros (Quinta-Feira)</h4>
                <div className="content">
                  <div className="content-escala" style={{ backgroundColor: 'transparent' }}>
                    <ThursdaySchedule />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isGuest && <BirthdaysThisMonth />}
        </PageWrapper>
      </ContainerHome>
    </Container>
  );
};

export default HomePage;
