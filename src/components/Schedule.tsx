import React, { useEffect, useState } from 'react';
import { createSchedules } from '../context/ScaleContext';
import Footer from './Footer';
import { ScheduleContainer, ScheduleContent, SeeScale } from './styles/Schedule';

type MonthName = "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro";

interface MusicianSchedule {
  date: string;
  vocal1: string;
  vocal2: string;
  teclas: string;
  batera: string;
  bass: string;
  guita: string;
}

export type MonthlySchedules = Record<MonthName, MusicianSchedule[]>;

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
            <p><strong>Vocal: </strong>{musician.vocal1}</p>
            <p><strong>Vocal: </strong>{musician.vocal2}</p>
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