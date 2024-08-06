import React from 'react';
import MusicLinkInput from '../components/MusicLinkInput';
import MusicLinkList from '../components/MusicLinkList';
import { useMusicContext } from '../context/hooks/useMusicContext';
import styled from 'styled-components'
import Header from '../components/Header';

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

const getNextSunday = (): string => {
  const today = new Date();
  const nextSunday = new Date(today.setDate(today.getDate() + (7 - today.getDay())));
  const day = String(nextSunday.getDate()).padStart(2, '0');
  const month = String(nextSunday.getMonth() + 1).padStart(2, '0');
  const year = nextSunday.getFullYear();
  return `${day}-${month}-${year}`;
};

const HomePage: React.FC = () => {
  const { getCurrentSundaySchedule } = useMusicContext();
  const currentSundaySchedule = getCurrentSundaySchedule();

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
          {currentSundaySchedule ? (
          <div className='content'>
            <p><strong>{getNextSunday()}</strong></p>
            <p><strong>Teclas: </strong>{currentSundaySchedule.teclas}</p>
            <p><strong>Batera: </strong>{currentSundaySchedule.batera}</p>
            <p><strong>Bass: </strong>{currentSundaySchedule.bass}</p>
            <p><strong>Guita: </strong>{currentSundaySchedule.guita}</p>
          </div>
          ) : (
          <p>Não há escala disponível para o próximo domingo.</p>
          )}
        </div>
      </ContainerHome>
    </Container>
  );
};

export default HomePage;