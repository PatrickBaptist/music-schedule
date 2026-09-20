import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import BirthdaysThisMonth from '../../components/birthdaysMonth/birthdaysMonth';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import useAuthContext from '../../context/hooks/useAuthContext';
import { UserRole } from '../../types/UserRole';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import { MotionButton } from '../../components/buttons/Buttons';
import useMusicLinksContext from '../../context/hooks/useMusicLinksContext';

const toLocalISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextSunday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return toLocalISODate(date);
};

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { specialSchedules, getSpecialSchedules } = useSchedulesContext();
  const { warning, getWarning } = useNotificationContext();
  const [isLoading, setIsLoading] = useState(true);
  const { user: loggedUser } = useAuthContext();
  const { musicLinks } = useMusicLinksContext();
  const fallbackDate = useMemo(getNextSunday, []);
  const [selectedMusicDate, setSelectedMusicDate] = useState(fallbackDate);
  const hasSelectedMusicDate = useRef(false);

  const isGuest = loggedUser?.roles?.includes(UserRole.Guest);

  const loggedRoles = loggedUser?.roles || [];
  const allowedRoles = [UserRole.Leader, UserRole.Minister, UserRole.Admin, UserRole.Vocal];
  const canAddMusic = loggedRoles.some((role) => allowedRoles.includes(role as UserRole));
  const weeklySchedules = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return (specialSchedules || []).filter((schedule) => {
      const [year, month, day] = schedule.data.slice(0, 10).split('-').map(Number);
      const scheduleDate = new Date(year, month - 1, day);
      return scheduleDate >= monday && scheduleDate <= sunday;
    });
  }, [specialSchedules]);
  const nearestRepertoireDate = useMemo(() => {
    const today = toLocalISODate(new Date());
    const futureDates = musicLinks
      .map((music) => music.scheduleDate?.slice(0, 10))
      .filter((date): date is string => Boolean(date && date >= today))
      .sort();

    return futureDates[0] || fallbackDate;
  }, [fallbackDate, musicLinks]);
  const selectedRepertoireLabel = useMemo(() => {
    if (!selectedMusicDate) return 'Data não selecionada';

    return new Date(`${selectedMusicDate}T12:00:00`).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedMusicDate]);
  const changeSelectedMusicDate = (date: string) => {
    hasSelectedMusicDate.current = true;
    setSelectedMusicDate(date);
  };

  useEffect(() => {
    if (!hasSelectedMusicDate.current) {
      setSelectedMusicDate(nearestRepertoireDate);
    }
  }, [nearestRepertoireDate]);

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
                  <h4>Adicionar repertório</h4>
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
                    <MusicLinkInput
                      setIsModalOpen={setIsModalOpen}
                      scheduleDate={selectedMusicDate}
                      onScheduleDateChange={changeSelectedMusicDate}
                    />
                  </AddFormOverlay>,
                  document.body
                )}

              <div className="repertoire-date-bar">
                <div className="repertoire-date-copy">
                  <span>Repertório exibido</span>
                  <h3>{selectedRepertoireLabel}</h3>
                </div>
                <label className="date-picker-trigger" htmlFor="music-schedule-date">
                  <FaCalendarAlt aria-hidden="true" />
                  <span>Trocar data</span>
                  <input
                    id="music-schedule-date"
                    type="date"
                    value={selectedMusicDate}
                    aria-label="Escolher outra data do repertório"
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) => changeSelectedMusicDate(event.target.value)}
                  />
                </label>
              </div>

              <MusicLinkList canDelete={loggedRoles} selectedDate={selectedMusicDate} legacyDate={fallbackDate} />
            </div>

            <div className="coluna-2">
              <div className="container-escala">
                <div className="schedule-heading">
                  <div>
                    <span className="section-kicker">Semana atual</span>
                    <h4>Escalas da semana</h4>
                  </div>
                </div>
                <div className="content">
                  <div className="special-tab-panel">
                    {isLoading ? <LoadingScreen /> : <SpecialSchedules schedules={weeklySchedules as SpecialSchedule[]} />}
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
