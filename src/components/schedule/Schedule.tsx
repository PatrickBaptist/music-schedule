import { useEffect, useState } from 'react';
import { ScheduleContainer, ScheduleContent, SeeScale } from './ScheduleStyle';
import LoadingScreen from '../loading/LoadingScreen';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import { toast } from 'sonner';
import PageWrapper from '../pageWrapper/pageWrapper';

const getTargetMonthAndYear = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const year = today.getFullYear();

  const lastDayOfMonth = new Date(year, currentMonth, 0).getDate();
  const daysLeftInMonth = lastDayOfMonth - today.getDate();

  let targetMonth = daysLeftInMonth <= 7 ? currentMonth + 1 : currentMonth;
  const targetYear = targetMonth > 12 ? year + 1 : year;

  if (targetMonth > 12) targetMonth = 1;

  return { targetMonth, targetYear };
};

// Retorna mês formatado MM-YYYY (ex: "08-2025")
const getFormattedMonth = (): string => {
  const { targetMonth, targetYear } = getTargetMonthAndYear();
  const formattedMonth = targetMonth.toString().padStart(2, "0");
  return `${formattedMonth}-${targetYear}`;
};

// Retorna o nome do mês em português
const getNameMonth = (): string => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const { targetMonth } = getTargetMonthAndYear();
  return monthNames[targetMonth - 1];
};

// Formata datas para o padrão YYYY-MM-DD (só data, sem hora)
const formatDateToYYYYMMDD = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Schedule: React.FC = () => {
  const { monthlySchedule, getScheduleForMonth, nextSundaySchedule } = useSchedulesContext();
  const [loading, setLoading] = useState(true);

  const currentMonth = getFormattedMonth();
  const nameMonth = getNameMonth();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        await getScheduleForMonth(currentMonth);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error("Sem premissão! " + err.message);
        } else {
          toast.error("Erro desconhecido ao buscar escala");
        }
      }
    };

    fetch();
  }, [getScheduleForMonth, currentMonth]);


  const isNextSunday = (dateString: string) => {
    if (!nextSundaySchedule) return false;
    return formatDateToYYYYMMDD(dateString) === nextSundaySchedule.date;
  };

  return (
    <ScheduleContainer>
      <PageWrapper>
        <ScheduleContent>
          <h1>Escala de {nameMonth}</h1>

          {loading ? (
            <LoadingScreen />
          ) : monthlySchedule && monthlySchedule.length > 0 ? (
            <span>
              {monthlySchedule.map((musician, index) => (
                <SeeScale key={index}>
                  <h3 style={{ color: isNextSunday(musician.date) ? 'red' : '#58a6ff' }}>{new Date(musician.date).toLocaleDateString("pt-BR")}</h3>
                  <p><strong>Vocal: </strong>{musician.músicos.vocal1 || 'Não definido'}</p>
                  <p><strong>Vocal: </strong>{musician.músicos.vocal2 || 'Não definido'}</p>
                  <p><strong>Teclas: </strong>{musician.músicos.teclas || 'Não definido'}</p>
                  <p><strong>Violão: </strong>{musician.músicos.violao || 'Não definido'}</p>
                  <p><strong>Batera: </strong>{musician.músicos.batera || 'Não definido'}</p>
                  <p><strong>Bass: </strong>{musician.músicos.bass || 'Não definido'}</p>
                  <p><strong>Guita: </strong>{musician.músicos.guita || 'Não definido'}</p>
                </SeeScale>
              ))}
            </span>
          ) : (
            <p>Nenhuma escala disponível para este mês</p>
          )}
        </ScheduleContent>
      </PageWrapper>
    </ScheduleContainer>
  );
};

export default Schedule;
