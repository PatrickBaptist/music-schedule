import { useEffect, useCallback } from 'react';
import useNotificationContext from '../../context/hooks/useNotificationContext';
import { toast } from 'sonner';
import useLoginContext from '../../context/hooks/useAuthContext';

const STORAGE_KEY = 'closedNotification';

const Notification = () => {
  const { notification, getNotification } = useNotificationContext();
  const { isAuthenticated } = useLoginContext();

  // Função para checar se a notificação fechada ainda está no cooldown
  const isBlocked = useCallback(() => {
  const closed = localStorage.getItem(STORAGE_KEY);
  if (!closed) return false;

  try {
    const { text, timestamp } = JSON.parse(closed);
    if (text !== notification?.text) return false;

    const now = Date.now();
    return now - timestamp < 1_200_000;
  } catch {
    return false;
  }
}, [notification?.text]);

  useEffect(() => {
    if (isAuthenticated) {
      getNotification();
      const interval = setInterval(() => {
        getNotification();
      }, 120000);
      return () => clearInterval(interval);
    }
  }, [getNotification, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && notification?.text && !isBlocked()) {
      toast(notification.text, {
        id: 'notification-toast', // garante que não duplica
        duration: 120000, // 1 minuto
        position: 'top-right',
        action: {
          label: 'Fechar',
          onClick: () => {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ text: notification?.text, timestamp: Date.now() })
            );
            toast.dismiss('notification-toast'); // fecha o toast
          },
        },
      });
    }
  }, [notification, isBlocked, isAuthenticated]);

  return null;
};

export default Notification;
