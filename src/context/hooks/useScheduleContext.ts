import { useContext } from 'react';
import { ScheduleContextProps, SchedulesService } from '../../services/ScheduleService';

export const useSchedulesContext = (): ScheduleContextProps => {
  const context = useContext(SchedulesService);
  if (!context) {
    throw new Error('useSchedulesContext must be used within a SchedulesProvider');
  }
  return context;
};

export default useSchedulesContext;