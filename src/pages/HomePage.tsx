import React, { useEffect, useState } from 'react';
import MusicLinkInput from '../components/MusicLinkInput';
import MusicLinkList from '../components/MusicLinkList';
import Header from '../components/Header';
import { createSchedules } from '../context/ScaleContext';
import Footer from '../components/Footer';
import { Container, ContainerHome } from './pageStyle/HomePage';
import EditLink from '../assets/imgs/edit.png'

type Schedule = {
  date: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  batera: string;
  bass: string;
  guita: string;
};

const HomePage: React.FC = () => {

  const [schedules, setSchedules] = useState<{ [key: string]: Schedule[] } | null>(null);
  const [nextSundaySchedule, setNextSundaySchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  schedules

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await createSchedules();
        setSchedules(data);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const day = today.getDay();
        const daysUntilSunday = (7 - day) % 7;
        const nextSunday = new Date(today);
        nextSunday.setDate(today.getDate() + daysUntilSunday);
        
        const nextSundayStr = nextSunday.toLocaleDateString('pt-BR');

        for (const month in data) {
          const currentMonthSchedules = data[month as keyof typeof data];
          currentMonthSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          for (const schedule of currentMonthSchedules) {
            if (schedule.date === nextSundayStr) {
              setNextSundaySchedule(schedule);
              return;
            }
          }
        }
        setNextSundaySchedule(null);
      } catch (error) {
        console.error("Erro ao buscar schedules:", error);
      }
    };


    fetchSchedules();
    const interval = setInterval(fetchSchedules, 1000 * 60 * 60 * 24);

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
            <p><strong>Vocal:</strong> {nextSundaySchedule.vocal1}</p>
            <p><strong>Vocal:</strong> {nextSundaySchedule.vocal2}</p>
            <p><strong>Teclas:</strong> {nextSundaySchedule.teclas}</p>
            <p><strong>Batera:</strong> {nextSundaySchedule.batera}</p>
            <p><strong>Bass:</strong> {nextSundaySchedule.bass}</p>
            <p><strong>Guita:</strong> {nextSundaySchedule.guita}</p>
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