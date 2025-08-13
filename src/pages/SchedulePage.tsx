import React from 'react';
import Schedule from '../components/Schedule';
import Header from '../components/Header';
import { ContainerSchedule } from './pageStyle/SchedulePage';
import Footer from '../components/Footer';

const SchedulePage: React.FC = () => {
  return (
    <ContainerSchedule>
      <Header>
        Voltar
      </Header>
      
      <Schedule />

      <Footer />
    </ContainerSchedule>
  );
};

export default SchedulePage;