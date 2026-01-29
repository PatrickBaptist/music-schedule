import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { CardsGrid, ScheduleContainer, ScheduleContent, SeeScale } from './ScheduleStyle';
import LoadingScreen from '../loading/LoadingScreen';
import useSchedulesContext from '../../context/hooks/useScheduleContext';
import { toast } from 'sonner';
import PageWrapper from '../pageWrapper/pageWrapper';
import { FaPlus } from 'react-icons/fa';
import ScheduleInput from '../scheduleInput/ScheduleInput';

const getTargetMonthAndYear = () => {
  const today = new Date();

  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7 || 7));

  const nextSundayMonth = nextSunday.getMonth() + 1;
  const nextSundayYear = nextSunday.getFullYear();

  return {
    targetMonth: nextSundayMonth,
    targetYear: nextSundayYear
  };
};

const getFormattedMonth = (): string => {
  const { targetMonth, targetYear } = getTargetMonthAndYear();
  const formattedMonth = targetMonth.toString().padStart(2, "0");
  return `${formattedMonth}-${targetYear}`;
};

const getNameMonth = (): string => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const { targetMonth } = getTargetMonthAndYear();
  return monthNames[targetMonth - 1];
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMonth = getFormattedMonth();
  const nameMonth = getNameMonth();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        await getScheduleForMonth(currentMonth);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (!err.message.includes("404")) {
            toast.error("Erro ao buscar escala: " + err.message);
          }
        } else {
          toast.error("Erro desconhecido ao buscar escala");
        }
      } finally {
        setLoading(false);
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
          <div className='add-schedule'>
            <h4>Adicionar escala</h4>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btns add-btn"
              onClick={() => setIsModalOpen(true)}
              >
              <FaPlus size={12} />
            </motion.button>
          </div>

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <ScheduleInput setIsModalOpen={setIsModalOpen}/>
              </div>
            </div>
          )}

          {loading ? (
                <LoadingScreen />
          ) : monthlySchedule && monthlySchedule.length > 0 ? (
            <CardsGrid>
              {monthlySchedule
            .slice()
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((musician, index) => (
              <SeeScale key={index}>
                <h3 style={{ color: isNextSunday(musician.date) ? 'red' : '#2EBEF2' }}>
                  {new Date(musician.date).toLocaleDateString("pt-BR")}
                </h3>
                <div className='content-escala'>
                  <p style={{ fontWeight: '500', color: '#f59e0b' }}><strong>Ministro: </strong>{musician.músicos.minister || 'Não definido'}</p>
                  <p><strong>Vocal: </strong>{musician.músicos.vocal1 || 'Não definido'}</p>
                  <p><strong>Teclas: </strong>{musician.músicos.teclas || 'Não definido'}</p>
                  <p><strong>Violão: </strong>{musician.músicos.violao || 'Não definido'}</p>
                  <p><strong>Batera: </strong>{musician.músicos.batera || 'Não definido'}</p>
                  <p><strong>Bass: </strong>{musician.músicos.bass || 'Não definido'}</p>
                  <p><strong>Guita: </strong>{musician.músicos.guita || 'Não definido'}</p>
                  <p><strong>Op. Som: </strong>{musician.músicos.sound || 'Não definido'}</p>
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
