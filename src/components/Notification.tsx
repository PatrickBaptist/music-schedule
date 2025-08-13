import React, { useState, useEffect, useRef, useCallback } from 'react';
import useNotificationContext from '../context/hooks/useNotificationContext';

const STORAGE_KEY = 'closedNotification';

const Notification = () => {
  const { notification, getNotification } = useNotificationContext();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    getNotification();
    const interval = setInterval(() => {
      getNotification();
    }, 60000);
    return () => clearInterval(interval);
  }, [getNotification]);

  useEffect(() => {
    if (notification?.text && !isBlocked()) {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 60000);
    } else {
      setVisible(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [notification, isBlocked]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ text: notification?.text, timestamp: Date.now() })
    );
  };

  if (!visible) return null;

  return (
    <div style={styles.notification}>
      <p>{notification?.text}</p>
      <button onClick={handleClose} style={styles.closeButton}>
        Fechar
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  notification: {
    position: 'fixed',
    top: '100px',
    right: '10px',
    backgroundColor: '#4eacff',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    zIndex: 2024,
  },
  closeButton: {
    background: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
    padding: '5px 10px',
  },
};

export default Notification;
