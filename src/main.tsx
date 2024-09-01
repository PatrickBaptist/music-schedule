import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './globalStyles';
import { MusicLinksProvider } from './context/MusicLinksContext';
import Notification from '../src/components/Notification'
import { UserStore } from './context/openMenuContext';
import Menu from './components/Menu';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserStore>
        <MusicLinksProvider>
        
          <GlobalStyle />
          <Notification />
          <Menu />
          <App />
        
        </MusicLinksProvider>
      </UserStore>
    </BrowserRouter>
  </React.StrictMode>
);