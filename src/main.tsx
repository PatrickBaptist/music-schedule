import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './globalStyles';
import { MusicLinksProvider } from './services/MusicLinksService';
import { UserStore } from './context/openMenuContext';
import Menu from './components/menu/Menu';
import { SchedulesProvider } from './services/ScheduleService';
import { NotificationProvider } from './services/NotificationService';
import Notification from './components/notification/Notification';
import { toast, Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserStore>
        <MusicLinksProvider>
          <SchedulesProvider>
            <NotificationProvider>
              <Notification /> 
              <GlobalStyle />
              <Menu />
              <App />
            </NotificationProvider>
          </SchedulesProvider>
        </MusicLinksProvider>
        <Toaster 
          richColors
          position='top-right'
          toastOptions={{
            actionButtonStyle: {
              backgroundColor: 'red'
            }
          }}
        />
      </UserStore>
    </BrowserRouter>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            toast('Nova versão disponível! Atualize o app.');
          }
        });
      };
    });
  });
}
