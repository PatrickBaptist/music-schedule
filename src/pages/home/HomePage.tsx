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
import { FaArrowRight, FaCalendarAlt, FaClock, FaMusic, FaPlus, FaUserCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuthContext from '../../context/hooks/useAuthContext';
import useMyScheduleContext from '../../context/hooks/useMyScheduleContext';
import { UserRole } from '../../types/UserRole';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import Button from '../../components/buttons/Buttons';
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

const formatSummaryDate = (date: Date) => date.toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

const getSummaryRelativeDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000);

  if (diff === 0) return 'É hoje';
  if (diff === 1) return 'É amanhã';
  return `Faltam ${diff} dias`;
};

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { specialSchedules, getSpecialSchedules } = useSchedulesContext();
  const { warning, getWarning } = useNotificationContext();
  const [isLoading, setIsLoading] = useState(true);
  const { user: loggedUser } = useAuthContext();
  const { assignments } = useMyScheduleContext();
  const { musicLinks } = useMusicLinksContext();
  const fallbackDate = useMemo(getNextSunday, []);
  const [selectedMusicDate, setSelectedMusicDate] = useState(fallbackDate);
  const hasSelectedMusicDate = useRef(false);

  const isGuest = loggedUser?.roles?.includes(UserRole.Guest);

  const loggedRoles = loggedUser?.roles || [];
  const allowedRoles = [UserRole.Leader, UserRole.Minister, UserRole.Admin, UserRole.Vocal];
  const canAddMusic = loggedRoles.some((role) => allowedRoles.includes(role as UserRole));
  const nextAssignment = assignments[0];
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
  const availableRepertoireDates = useMemo(() => {
    const today = toLocalISODate(new Date());
    const dates = new Map<string, number>();

    musicLinks.forEach((music) => {
      const date = music.scheduleDate?.slice(0, 10);
      if (!date || date < today) return;
      dates.set(date, (dates.get(date) || 0) + 1);
    });

    return Array.from(dates, ([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [musicLinks]);
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

          <section className="home-summary-card" aria-labelledby="home-summary-title">
            <div className="home-summary-date" aria-hidden="true">
              {nextAssignment ? (
                <>
                  <strong>{nextAssignment.date.toLocaleDateString('pt-BR', { day: '2-digit' })}</strong>
                  <span>{nextAssignment.date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                </>
              ) : (
                <FaCalendarAlt />
              )}
            </div>

            <div className="home-summary-main">
              <span className="home-summary-eyebrow">
                Próximo compromisso
                {nextAssignment && <em>{getSummaryRelativeDate(nextAssignment.date)}</em>}
              </span>
              {isLoading ? (
                <>
                  <h1 id="home-summary-title">Carregando sua agenda...</h1>
                </>
              ) : nextAssignment ? (
                <>
                  <h1 id="home-summary-title">{nextAssignment.title}</h1>
                  <div className="home-summary-schedule">
                    <span><FaCalendarAlt aria-hidden="true" />{formatSummaryDate(nextAssignment.date)}</span>
                    <span><FaClock aria-hidden="true" />{nextAssignment.startTime || 'Horário a definir'}</span>
                  </div>
                </>
              ) : (
                <>
                  <h1 id="home-summary-title">Nenhuma escala próxima</h1>
                  <p>Quando você entrar em uma equipe, o compromisso aparecerá aqui.</p>
                </>
              )}

              {nextAssignment && (
                <div className="home-summary-details" aria-label="Resumo da próxima escala">
                  <span>
                    <FaUserCheck aria-hidden="true" />
                    {nextAssignment.roles.join(', ')}
                  </span>
                  <span>
                    <FaMusic aria-hidden="true" />
                    {nextAssignment.musicLinks.length} {nextAssignment.musicLinks.length === 1 ? 'música' : 'músicas'}
                  </span>
                </div>
              )}
            </div>

            <nav className="home-summary-actions" aria-label="Atalhos do compromisso">
              <Link className="home-summary-link primary" to="/my-schedule">
                <FaUserCheck aria-hidden="true" />
                Minha escala
                <FaArrowRight className="home-summary-arrow" aria-hidden="true" />
              </Link>
              {!isGuest && (
                <button
                  type="button"
                  className="home-summary-link secondary"
                  onClick={() => document.getElementById('home-music-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <FaMusic aria-hidden="true" />
                  Ver músicas
                </button>
              )}
            </nav>
          </section>

          <div className="desktop-layout">
            <div className="coluna-1">
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

              <section className="available-repertoires" aria-labelledby="available-repertoires-title">
                <div className="available-repertoires-heading">
                  <div>
                    <FaMusic aria-hidden="true" />
                    <strong id="available-repertoires-title">Repertórios</strong>
                  </div>
                  <span>Escolha uma data para abrir</span>
                </div>
                {availableRepertoireDates.length ? (
                  <div className="repertoire-date-options">
                    {availableRepertoireDates.map(({ date, count }) => {
                      const parsedDate = new Date(`${date}T12:00:00`);
                      const weekday = parsedDate.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                      const shortDate = parsedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                      const isSelected = date === selectedMusicDate;

                      return (
                        <button
                          type="button"
                          key={date}
                          className={isSelected ? 'active' : ''}
                          aria-pressed={isSelected}
                          onClick={() => changeSelectedMusicDate(date)}
                        >
                          <span className="repertoire-option-date">
                            <strong>{weekday}</strong>
                            <small>{shortDate}</small>
                          </span>
                          <span className="repertoire-option-count">{count}</span>
                          <span className="sr-only">{count === 1 ? 'música' : 'músicas'}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p>Nenhum repertório futuro possui músicas.</p>
                )}
              </section>

              <div className="repertoire-date-bar">
                <div className="repertoire-date-copy">
                  <span>Repertório exibido</span>
                  <h3>{selectedRepertoireLabel}</h3>
                </div>
                <div className="repertoire-date-actions">
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
                  {canAddMusic && (
                    <Button
                      variant="primary"
                      size="md"
                      className="add-music-button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FaPlus aria-hidden="true" />
                      <span>Adicionar música</span>
                    </Button>
                  )}
                </div>
              </div>

              <div id="home-music-list" className="home-music-list-anchor">
                <MusicLinkList canDelete={loggedRoles} selectedDate={selectedMusicDate} legacyDate={fallbackDate} />
              </div>
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
                  <div
                    className="special-tab-panel"
                    role="region"
                    aria-label="Escalas da semana"
                    tabIndex={0}
                  >
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
