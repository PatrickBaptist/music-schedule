import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './globalStyles';
import { MusicLinksProvider } from './services/MusicLinksService';
import { SchedulesProvider } from './services/ScheduleService';
import { NotificationProvider } from './services/NotificationService';
import { Toaster } from 'sonner';
import { AuthProvider } from './services/AuthService';
import LayoutWrapper from './components/layoutWrapper/layoutWrapper';
import { AllMusicLinksProvider } from './services/AllMusicHistory';
import { UsersProvider } from './services/UsersService';
import { ScrollProvider } from './context/scrollContext';
import WakeUpScreen from './components/WakeUpSistem/wakeUpLoader';
import { ServerProvider } from './services/wakeUpService';
import { ThemePreferenceProvider } from './context/themeContext';
import { MyScheduleProvider } from './services/MyScheduleService';
import { VideoPlayerProvider } from './context/videoPlayerContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemePreferenceProvider>
        <GlobalStyle />
        <UsersProvider>
          <ServerProvider>
            <WakeUpScreen>
              <AuthProvider>
                <AllMusicLinksProvider>
                  <MusicLinksProvider>
                    <SchedulesProvider>
                      <MyScheduleProvider>
                        <NotificationProvider>
                          <LayoutWrapper>
                            <ScrollProvider>
                              <VideoPlayerProvider>
                                <App />
                              </VideoPlayerProvider>
                            </ScrollProvider>
                          </LayoutWrapper>
                        </NotificationProvider>
                      </MyScheduleProvider>
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
              </AuthProvider>
            </WakeUpScreen>
          </ServerProvider>
        </UsersProvider>
      </ThemePreferenceProvider>
    </BrowserRouter>
  </React.StrictMode>
);
