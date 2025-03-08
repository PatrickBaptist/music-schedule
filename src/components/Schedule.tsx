import { useEffect, useState } from 'react';
import Footer from './Footer';
import { ScheduleContainer, ScheduleContent, SeeScale } from './styles/Schedule';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import LoadingScreen from './LoadingScreen';

interface MusicianSchedule {
  date: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  batera: string;
  bass: string;
  guita: string;
}

const getFormattedMonth = (): string => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() retorna de 0 a 11, então somamos 1
  const year = today.getFullYear();

  // Verifica se estamos na última semana do mês
  const lastDayOfMonth = new Date(year, currentMonth, 0).getDate();
  const daysLeftInMonth = lastDayOfMonth - today.getDate();

  const targetMonth = daysLeftInMonth <= 7 ? currentMonth + 1 : currentMonth;
  const targetYear = targetMonth > 12 ? year + 1 : year;
  const formattedMonth = (targetMonth > 12 ? 1 : targetMonth).toString().padStart(2, "0");

  return `${formattedMonth}-${targetYear}`;
};

const Schedule: React.FC = () => {
  const [monthlySchedules, setMonthlySchedules] = useState<MusicianSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const month = getFormattedMonth();
        console.log(`Buscando escalas para o mês: ${month}`);

        const docRef = doc(db, "schedules", month);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
          console.log(`Documento encontrado para o mês de ${month}`);

          const data = snapshot.data();
          if (!data?.sundays) {
            console.warn(`Nenhuma escala encontrada para o mês de ${month}`);
            setMonthlySchedules([]);
            return;
          }

          const schedules: MusicianSchedule[] = data.sundays.map((sunday: any) => ({
            date: new Date(sunday.date).toLocaleDateString("pt-BR"),
            vocal1: sunday.músicos?.vocal1 || "Não definido",
            vocal2: sunday.músicos?.vocal2 || "Não definido",
            teclas: sunday.músicos?.teclas || "Não definido",
            batera: sunday.músicos?.batera || "Não definido",
            bass: sunday.músicos?.bass || "Não definido",
            guita: sunday.músicos?.guita || "Não definido"
          }));
          
          schedules.sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());

          setMonthlySchedules(schedules);
        } else {
          console.warn(`Documento não encontrado para o mês de ${month}`);
          setMonthlySchedules([]);
        }
      } catch (error) {
        console.error("Erro ao buscar schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const currentMonth = getFormattedMonth();

  return (
    <ScheduleContainer>
      <ScheduleContent>
        <h1>Escala de {currentMonth}</h1>

        {loading ? (
            <LoadingScreen />
          ) : monthlySchedules.length > 0 ? (
            <span>
              {monthlySchedules.map((musician, index) => (
                <SeeScale key={index}>
                  <h3>{musician.date}</h3>
                  <p><strong>Vocal: </strong>{musician.vocal1}</p>
                  <p><strong>Vocal: </strong>{musician.vocal2}</p>
                  <p><strong>Teclas: </strong>{musician.teclas}</p>
                  <p><strong>Batera: </strong>{musician.batera}</p>
                  <p><strong>Bass: </strong>{musician.bass}</p>
                  <p><strong>Guita: </strong>{musician.guita}</p>
                </SeeScale>
              ))}
            </span>
          ) : (
            <p>Nenhuma escala disponível para este mês.</p>
          )}
      </ScheduleContent>     

      <Footer /> 
    </ScheduleContainer>
  );
};

export default Schedule;