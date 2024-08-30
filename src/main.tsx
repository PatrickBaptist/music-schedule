import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './globalStyles';
import { MusicLinksProvider } from './context/MusicLinksContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MusicLinksProvider>
        
          <GlobalStyle />
          <App />
        
      </MusicLinksProvider>
    </BrowserRouter>
  </React.StrictMode>
);