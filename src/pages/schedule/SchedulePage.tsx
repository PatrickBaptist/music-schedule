import React from 'react';
import Schedule from '../../components/schedule/Schedule';
import Header from '../../components/header/Header';
import { ContainerSchedule } from './SchedulePageStyle';
import Footer from '../../components/footer/Footer';

const SchedulePage: React.FC = () => {
  return (
    <ContainerSchedule>
      <Header />
      
      <Schedule />

      <Footer />
    </ContainerSchedule>
  );
};

export default SchedulePage;