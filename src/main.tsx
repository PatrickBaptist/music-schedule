import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './globalStyles';
import { MusicLinksProvider } from './services/MusicLinksService';
import { SchedulesProvider } from './services/ScheduleService';
import { NotificationProvider } from './services/NotificationService';
import { toast, Toaster } from 'sonner';
import { AuthProvider } from './services/AuthService';
import LayoutWrapper from './components/layoutWrapper/layoutWrapper';
import { AllMusicLinksProvider } from './services/AllMusicHistory';
import { UsersProvider } from './services/UsersService';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <UsersProvider>
            <AllMusicLinksProvider>
              <MusicLinksProvider>
                <SchedulesProvider>
                  <NotificationProvider>
                    <GlobalStyle />
                      <LayoutWrapper>  
                        <App />
                      </LayoutWrapper>
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
            </AllMusicLinksProvider>
          </UsersProvider>
      </AuthProvider>
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
