import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMusicContext } from '../context/hooks/useMusicContext';

const ScheduleContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #cde8ff;
  box-sizing: border-box;
  margin-top: 80px;
  overflow-y: auto;
  padding: 35px 0;

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
`

const ScheduleContent = styled.div`
    width: 100%;
    display: flex;
    align-items: center;

    span {
      width: 100%;
      display: flex;
      gap: 0 10px;
      overflow-x: auto;

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

      @media(max-width: 670px) {
        display: grid;
        grid-template-columns: 200px 200px;
        align-items: center;
        justify-content: center;
        gap: 10px;

        overflow-x: hidden;
      }      
    }
`

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
`

const Schedule: React.FC = () => {
  const { schedule } = useMusicContext();
  const [sundays, setSundays] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const getSundaysOfCurrentMonth = (): string[] => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const sundays: string[] = [];

      const date = new Date(currentYear, currentMonth, 1);

      while (date.getDay() !== 0) {
        date.setDate(date.getDate() + 1);
      }

      while (date.getMonth() === currentMonth) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        sundays.push(`${day}-${month}-${year}`);
        date.setDate(date.getDate() + 7);
      }

      return sundays;
    };

    const updateSundays = () => {
      setSundays(getSundaysOfCurrentMonth());
    };

    const getStoredIndex = () => {
      const storedIndex = localStorage.getItem('lastScaleIndex');
      return storedIndex ? parseInt(storedIndex, 10) : 0;
    };

    const updateIndex = (index: number) => {
      localStorage.setItem('lastScaleIndex', index.toString());
      setCurrentIndex(index);
    };

    const checkAndUpdateIndex = () => {
      const storedIndex = getStoredIndex();
      const currentMonth = new Date().getMonth();
      const lastUpdateMonth = parseInt(localStorage.getItem('lastUpdateMonth') || '0', 10);

      if (currentMonth !== lastUpdateMonth) {
        updateIndex((storedIndex + sundays.length) % schedule.length);
        localStorage.setItem('lastUpdateMonth', currentMonth.toString());
      } else {
        setCurrentIndex(storedIndex);
      }
    };

    updateSundays();
    checkAndUpdateIndex();

    const intervalId = setInterval(updateSundays, 86400000);

    return () => clearInterval(intervalId);
  }, [schedule.length, sundays.length]);

  return (
    <ScheduleContainer>
      <h1>Escala de músicos</h1>
      <ScheduleContent>
        <span>
        {sundays.map((sunday, index) => (
          <SeeScale key={index}>
            <h3>{sunday}</h3>
            {schedule[index] ? (
              <>
                <p><strong>Teclas: </strong>{schedule[(currentIndex + index) % schedule.length]?.teclas}</p>
                <p><strong>Batera: </strong>{schedule[(currentIndex + index) % schedule.length]?.batera}</p>
                <p><strong>Bass: </strong>{schedule[(currentIndex + index) % schedule.length]?.bass}</p>
                <p><strong>Guita: </strong>{schedule[(currentIndex + index) % schedule.length]?.guita}</p>
              </>
            ) : (
              <p>Não há escala disponível para este domingo.</p>
            )}
          </SeeScale>
        ))}
        </span>
      </ScheduleContent>
    </ScheduleContainer>
  );
};

export default Schedule;
