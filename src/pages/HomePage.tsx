import React, { useEffect, useState } from 'react';
import MusicLinkInput from '../components/MusicLinkInput';
import MusicLinkList from '../components/MusicLinkList';
import Header from '../components/Header';
import { createSchedules } from '../context/ScaleContext';
import Footer from '../components/Footer';
import { Container, ContainerHome } from './pageStyle/HomePage';

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

  schedules;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await createSchedules();
        setSchedules(data);

        const today = new Date();
        for (const month in data) {
          const currentMonthSchedules = data[month as keyof typeof data];
          
          for (let i = 0; i < currentMonthSchedules.length; i++) {
            const scheduleDate = new Date(currentMonthSchedules[i].date);
            
            if (scheduleDate > today) {
              setNextSundaySchedule(currentMonthSchedules[i]);
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
  }, []);

  return (
    <Container>
      <Header>
        Escala
      </Header>
      <ContainerHome>
        <h1>Louvores</h1>
        <MusicLinkInput />
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