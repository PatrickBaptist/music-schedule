import { useContext } from 'react';
import { MyScheduleService } from '../../services/MyScheduleService';

const useMyScheduleContext = () => {
  const context = useContext(MyScheduleService);
  if (!context) throw new Error('useMyScheduleContext must be used within MyScheduleProvider');
  return context;
};

export default useMyScheduleContext;
