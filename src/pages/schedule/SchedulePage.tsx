import React from 'react';
import Schedule from '../../components/schedule/Schedule';
import { ContainerSchedule } from './SchedulePageStyle';

const SchedulePage: React.FC = () => {
  return (
    <ContainerSchedule>      
      <Schedule />
    </ContainerSchedule>
  );
};

export default SchedulePage;