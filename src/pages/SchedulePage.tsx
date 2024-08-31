import React from 'react';
import Schedule from '../components/Schedule';
import styled from 'styled-components';
import Header from '../components/Header';

const ContainerSchedule = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`

const SchedulePage: React.FC = () => {
  return (
    <ContainerSchedule>
      <Header>
        Voltar
      </Header>
      
      <Schedule />

    </ContainerSchedule>
  );
};

export default SchedulePage;