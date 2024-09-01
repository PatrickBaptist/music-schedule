import React from 'react';
import Schedule from '../components/Schedule';
import Header from '../components/Header';
import { ContainerSchedule } from './pageStyle/SchedulePage';

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