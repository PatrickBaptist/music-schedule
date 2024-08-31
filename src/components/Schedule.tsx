import React, { useEffect, useState } from 'react';
import { createSchedules } from '../context/ScaleContext';
import styled from 'styled-components';
import Footer from './Footer';

type MonthName = "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro";

interface MusicianSchedule {
  date: string;
  teclas: string;
  batera: string;
  bass: string;
  guita: string;
}

export type MonthlySchedules = Record<MonthName, MusicianSchedule[]>;

const ScheduleContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100%;
  background-color: #cde8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
`;

const ScheduleContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  overflow: auto;
  
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #fff;
    border-radius: 1em;
  }
    
  &::-webkit-scrollbar-button {
    display: none;
  }
      
  &::-webkit-scrollbar-thumb {
    background-color: #7fc3ff;
    border-radius: 1em;
  }

  h1 {
    margin-top: 100px;
  }

  span {
    width: 100%;
    display: flex;
    gap: 0 10px;

    @media (max-width: 670px) {
      display: grid;
      grid-template-columns: 200px 200px;
      align-items: center;
      justify-content: center;
      gap: 10px;
      overflow-x: hidden;
    }
  }
`;

const SeeScale = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #b6d8f7;
  
  h3 {
    font-size: 18px;
  }

  p {
    font-size: 16px;
  }
`;

const getCurrentMonthName = (): MonthName => {
  const monthNames: MonthName[] = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const today = new Date();
  const currentMonthIndex = today.getMonth();
  const nextMonthIndex = (currentMonthIndex + 1) % 12;

  // Obtendo o último dia do mês atual
  const lastDayOfMonth = new Date(today.getFullYear(), currentMonthIndex + 1, 0);
  const daysLeftInMonth = lastDayOfMonth.getDate() - today.getDate();

  // Se faltam 7 dias ou menos para o final do mês, mostre o próximo mês
  if (daysLeftInMonth <= 7) {
    return monthNames[nextMonthIndex];
  } else {
    return monthNames[currentMonthIndex];
  }
};

const Schedule: React.FC = () => {

  const [monthlySchedules, setMonthlySchedules] = useState<MusicianSchedule[]>([]);
  const currentMonth = getCurrentMonthName();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedules: MonthlySchedules = await createSchedules();
        setMonthlySchedules(schedules[currentMonth] || []);
      } catch (error) {
        console.error("Erro ao buscar schedules:", error);
      }
    };

    fetchSchedules();
  }, [currentMonth]);

  return (
    <ScheduleContainer>
      <ScheduleContent>
        <h1>Escala de {currentMonth}</h1>
        <span>
        {monthlySchedules.map((musician, index) => (
          <SeeScale key={index}>
            <h3>{musician.date}</h3>
            <p><strong>Teclas: </strong>{musician.teclas}</p>
            <p><strong>Batera: </strong>{musician.batera}</p>
            <p><strong>Bass: </strong>{musician.bass}</p>
            <p><strong>Guita: </strong>{musician.guita}</p>
          </SeeScale>
        ))}
        </span>
      </ScheduleContent>     

      <Footer /> 
    </ScheduleContainer>
  );
};

export default Schedule;