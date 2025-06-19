import React, { useEffect, useState } from 'react';
import MusicLinkInput from '../components/MusicLinkInput';
import MusicLinkList from '../components/MusicLinkList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, ContainerHome } from './pageStyle/HomePage';
import EditLink from '../assets/imgs/edit.png'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type Schedule = {
  date: string;
  músicos:{
    teclas: string;
    batera: string;
    bass: string;
    guita: string;
    vocal1: string;
    vocal2: string;
  };
};

const HomePage: React.FC = () => {

  const [, setSchedules] = useState<{ [key: string]: Schedule[] } | null>(null);
  const [nextSundaySchedule, setNextSundaySchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFormattedMonth = (): string => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() retorna de 0 a 11, então somamos 1
    const year = today.getFullYear();
  
    // Formatação do mês e ano no formato MM-YYYY
    const formattedMonth = currentMonth.toString().padStart(2, "0"); // Garante que o mês tenha 2 dígitos
    return `${formattedMonth}-${year}`;
  };

  useEffect(() => {

    const fetchSchedulesFromFirebase = async () => {
    try {
      const month = getFormattedMonth(); // Nome do mês atual
      const docRef = doc(db, 'schedules', month);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        const sundays: Schedule[] = data?.sundays || [];
        
        // Organizar as escalas de acordo com a data
        const schedulesByMonth: { [key: string]: Schedule[] } = {};

        sundays.forEach((sunday: Schedule) =>{
          const date = new Date(sunday.date).toLocaleDateString('pt-BR');
          if (!schedulesByMonth[date]) {
            schedulesByMonth[date] = [];
          }
          schedulesByMonth[date].push(sunday) // Adiciona a escala do domingo
        });

        setSchedules(schedulesByMonth);

        // Determinar o próximo domingo
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const day = today.getDay();
        const daysUntilSunday = (7 - day) % 7;
        const nextSunday = new Date(today);
        nextSunday.setDate(today.getDate() + daysUntilSunday);

        const nextSundayStr = nextSunday.toLocaleDateString('pt-BR');
        const nextSchedule = schedulesByMonth[nextSundayStr]?.[0]; // Pega a primeira escala do próximo domingo
        
        setNextSundaySchedule(nextSchedule);
      } else {
        console.log("Documento não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar schedules:", error);
    }
  };
  
    fetchSchedulesFromFirebase();
    const interval = setInterval(fetchSchedulesFromFirebase, 1000 * 60 * 60 * 24);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Header>
        Escala
      </Header>
      <ContainerHome>

        <div className='content-louvores'>
        <h1>Louvores</h1>
         <button className='btn-write' onClick={() => setIsModalOpen(true)}>
            <img src={EditLink} alt="editLink" />
         </button>
        </div>

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <MusicLinkInput setIsModalOpen={setIsModalOpen}/>
              </div>
            </div>
          )}

        <MusicLinkList />

        <div className='container-escala'>
          <h1>Escala de músicos</h1>
          {nextSundaySchedule ? (
          <div className='content'>
            <h2>Próximo domingo</h2>
            <p><strong>Vocal:</strong> {nextSundaySchedule.músicos.vocal1}</p>
            <p><strong>Vocal:</strong> {nextSundaySchedule.músicos.vocal2}</p>
            <p><strong>Teclas:</strong> {nextSundaySchedule.músicos.teclas}</p>
            <p><strong>Batera:</strong> {nextSundaySchedule.músicos.batera}</p>
            <p><strong>Bass:</strong> {nextSundaySchedule.músicos.bass}</p>
            <p><strong>Guita:</strong> {nextSundaySchedule.músicos.guita}</p>
          </div>
        ) : (
          <p>Não há escala disponível.</p>
        )}
        </div>
        <Footer />
      </ContainerHome>
    </Container>
  );
};

export default HomePage;