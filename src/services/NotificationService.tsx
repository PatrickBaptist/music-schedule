import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';

export interface Notification {
  text?: string;
}

export interface NotificationContextProps {
  notification: Notification | null;
  getNotification: () => Promise<void>;
  postNotification: (text: string) => Promise<void>;
}

export const NotificationService = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const getNotification = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/notification`);
      if (!res.ok) throw new Error('Erro ao buscar notificação');
      const data = await res.json();
      setNotification(data);
    } catch (err) {
      console.error('Erro ao buscar notificação:', err);
      setNotification(null);
      throw err;
    }
  }, [API_URL]);

  useEffect(() => {
    getNotification();
  }, [getNotification]);

  const postNotification = async (text: string) => {
    try {
      const res = await fetch(`${API_URL}/notification`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('Erro ao postar notificação');
      await getNotification();
    } catch (err) {
      console.error('Erro ao postar notificação:', err);
      throw err;
    }
  };

  return (
    <NotificationService.Provider value={{ notification, getNotification, postNotification }}>
      {children}
    </NotificationService.Provider>
  );
};
