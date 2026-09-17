import { useEffect } from 'react';
import { FaCalendarAlt, FaCalendarPlus, FaClock, FaPalette } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/loading/LoadingScreen';
import PageWrapper from '../../components/pageWrapper/pageWrapper';
import useMyScheduleContext from '../../context/hooks/useMyScheduleContext';
import { downloadCalendarEvent } from '../../helpers/calendar';
import {
  AssignmentCard,
  AssignmentGrid,
  CalendarButton,
  CardHeader,
  EmptyState,
  Hero,
  InfoLine,
  MyScheduleContainer,
  RoleChip,
  RoleList,
  ScheduleLink,
  TypeLabel,
} from './MySchedulePageStyle';

const formatLongDate = (date: Date) => date.toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

const getRelativeDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000);

  if (diff === 0) return 'É hoje';
  if (diff === 1) return 'É amanhã';
  return `Faltam ${diff} dias`;
};

const MySchedulePage = () => {
  const { assignments, isLoading, loadError, markAssignmentsAsSeen } = useMyScheduleContext();

  useEffect(() => {
    if (!isLoading) markAssignmentsAsSeen();
  }, [isLoading, markAssignmentsAsSeen]);

  return (
    <MyScheduleContainer>
      <PageWrapper>
        <Hero>
          <span>Agenda pessoal</span>
          <h1>Minha Escala</h1>
          <p>Veja quando e em qual função participará das próximas equipes.</p>
        </Hero>

        {isLoading ? (
          <LoadingScreen />
        ) : assignments.length > 0 ? (
          <AssignmentGrid>
            {assignments.map((assignment, index) => (
              <AssignmentCard key={assignment.id} $featured={index === 0}>
                <CardHeader>
                  <div>
                    {index === 0 && <span className="next-label">Próxima escala</span>}
                    <TypeLabel>{assignment.type}</TypeLabel>
                  </div>
                  <strong>{getRelativeDate(assignment.date)}</strong>
                </CardHeader>

                <h2>{assignment.title}</h2>

                <InfoLine>
                  <FaCalendarAlt aria-hidden="true" />
                  <span>{formatLongDate(assignment.date)}</span>
                </InfoLine>

                <InfoLine>
                  <FaClock aria-hidden="true" />
                  <span>{assignment.startTime || 'Horário não definido'}</span>
                </InfoLine>

                <RoleList aria-label="Suas funções nesta escala">
                  {assignment.roles.map((role) => <RoleChip key={role}>{role}</RoleChip>)}
                </RoleList>

                <InfoLine>
                  <FaPalette aria-hidden="true" />
                  <span><strong>Paleta:</strong> {assignment.outfitColor || 'Não definida'}</span>
                </InfoLine>

                <CalendarButton type="button" variant="secondary" onClick={() => downloadCalendarEvent(assignment)}>
                  <FaCalendarPlus aria-hidden="true" />
                  Adicionar à agenda
                </CalendarButton>
              </AssignmentCard>
            ))}
          </AssignmentGrid>
        ) : (
          <EmptyState>
            <FaCalendarAlt aria-hidden="true" />
            <h2>Nenhuma escala próxima</h2>
            <p>{loadError ? 'Não foi possível carregar todas as escalas. Tente novamente mais tarde.' : 'Você não está escalado no mês atual nem no próximo mês.'}</p>
          </EmptyState>
        )}

        <ScheduleLink as={Link} to="/schedule">Ver escala completa</ScheduleLink>
      </PageWrapper>
    </MyScheduleContainer>
  );
};

export default MySchedulePage;
