import React, { useEffect, useState } from 'react';
import MusicLinkInput from '../components/MusicLinkInput';
import MusicLinkList from '../components/MusicLinkList';
import styled from 'styled-components'
import Header from '../components/Header';
import { createSchedules } from '../context/ScaleContext';
import Footer from '../components/Footer';

type Schedule = {
  date: string;
  teclas: string;
  batera: string;
  bass: string;
  guita: string;
};

const Container = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #cde8ff;
  box-sizing: border-box;
  overflow: hidden;
`

const ContainerHome = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    overflow-y: auto;

    h1 {
        margin: 25px 0;
    }

    p {
        font-size: 20px;
    }

    .container-escala {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      background-color: #b6d8f7;
      border-top: 1px solid #949494;
      padding-bottom: 25px;

        p {
            font-size: 20px;
        }
      
        .content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          p {
            padding: 0;
            margin: 5px;
          }
        }
    }
`

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
        setNextSundaySchedule(null); // Caso não encontre uma próxima escala
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