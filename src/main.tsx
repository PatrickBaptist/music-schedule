import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './globalStyles';
import { MusicProvider } from './context/MusicContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MusicProvider>
        <GlobalStyle />
        <App />
      </MusicProvider>
    </BrowserRouter>
  </React.StrictMode>
);