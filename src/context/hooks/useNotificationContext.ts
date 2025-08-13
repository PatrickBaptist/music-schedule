import { useContext } from 'react';
import { NotificationContextProps, NotificationService } from '../../services/NotificationService';

export const useNotificationContext = (): NotificationContextProps => {
  const context = useContext(NotificationService);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export default useNotificationContext;