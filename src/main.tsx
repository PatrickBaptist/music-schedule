import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './globalStyles';
import { MusicLinksProvider } from './services/MusicLinksService';
import { UserStore } from './context/openMenuContext';
import Menu from './components/Menu';
import { SchedulesProvider } from './services/ScheduleService';
import { NotificationProvider } from './services/NotificationService';
import Notification from './components/Notification';

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
      </UserStore>
    </BrowserRouter>
  </React.StrictMode>
);