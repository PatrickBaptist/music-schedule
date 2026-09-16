import React, { useEffect, useMemo, useState } from 'react';
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
import { SpecialSchedule } from '../../services/ScheduleService';
import ThursdaySchedule from '../../components/thursdaySchedule/thursday';
import BirthdaysThisMonth from '../../components/birthdaysMonth/birthdaysMonth';
import { FaPlus } from 'react-icons/fa';
import useAuthContext from '../../context/hooks/useAuthContext';
import { UserRole } from '../../types/UserRole';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import useUsersContext from '../../context/hooks/useUsersContext';
import type { User } from '../../services/UsersService';
import Button, { MotionButton } from '../../components/buttons/Buttons';
import ScheduledPerson from '../../components/scheduledPerson/ScheduledPerson';

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleTab, setScheduleTab] = useState<'sunday' | 'thursday' | 'special'>('sunday');
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
                  <MotionButton variant="unstyled"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btns add-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaPlus size={12} />
                  </MotionButton>
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
                <div className="schedule-heading">
                  <div>
                    <span className="section-kicker">Próximas equipes</span>
                    <h4>Escalas</h4>
                  </div>
                  <div className="schedule-tabs" role="tablist" aria-label="Tipo de escala">
                    <Button variant="tab" role="tab" aria-selected={scheduleTab === 'sunday'} className={scheduleTab === 'sunday' ? 'active' : ''} onClick={() => setScheduleTab('sunday')}>Domingo</Button>
                    <Button variant="tab" role="tab" aria-selected={scheduleTab === 'thursday'} className={scheduleTab === 'thursday' ? 'active' : ''} onClick={() => setScheduleTab('thursday')}>Quinta-feira</Button>
                    <Button variant="tab" role="tab" aria-selected={scheduleTab === 'special'} className={scheduleTab === 'special' ? 'active' : ''} onClick={() => setScheduleTab('special')}>Especiais</Button>
                  </div>
                </div>
                <div className="content">
                  {scheduleTab === 'special' ? (
                    <div className="special-tab-panel">
                      {specialSchedules && <SpecialSchedules usersRoles={loggedRoles} schedules={specialSchedules as SpecialSchedule[]} loading={isLoading} />}
                    </div>
                  ) : scheduleTab === 'thursday' ? (
                    <div className="thursday-tab-panel"><ThursdaySchedule /></div>
                  ) : isLoading ? (
                    <LoadingScreen />
                  ) : nextSundaySchedule ? (
                    <div className="content-escala">
                      <p style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                        <strong>Ministro: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.minister.length > 0 ? nextSundaySchedule.músicosIds.minister : nextSundaySchedule.músicos.minister} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Vocal: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.vocal.length > 0 ? nextSundaySchedule.músicosIds.vocal : nextSundaySchedule.músicos.vocal} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Teclas: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.teclas.length > 0 ? nextSundaySchedule.músicosIds.teclas : nextSundaySchedule.músicos.teclas} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Violão: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.violao.length > 0 ? nextSundaySchedule.músicosIds.violao : nextSundaySchedule.músicos.violao} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Batera: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.batera.length > 0 ? nextSundaySchedule.músicosIds.batera : nextSundaySchedule.músicos.batera} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Bass: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.bass.length > 0 ? nextSundaySchedule.músicosIds.bass : nextSundaySchedule.músicos.bass} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Guita: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.guita.length > 0 ? nextSundaySchedule.músicosIds.guita : nextSundaySchedule.músicos.guita} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Op. Som: </strong>
                        <ScheduledPerson people={nextSundaySchedule.músicosIds.sound.length > 0 ? nextSundaySchedule.músicosIds.sound : nextSundaySchedule.músicos.sound} usersById={usersById} />
                      </p>
                      <p>
                        <strong>Paleta de cores: </strong>
                        <span style={{ fontStyle: 'italic' }}>{nextSundaySchedule.músicosIds.outfitColor || 'Não definido'}</span>
                      </p>
                    </div>
                  ) : (
                    <p>Não há escala disponível</p>
                  )}
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
