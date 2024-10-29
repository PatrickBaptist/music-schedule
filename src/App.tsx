import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ListMusic from './pages/ListMusic';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // Simule um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 2000)); // ajuste o tempo conforme necessário
      // Aguarde um pouco para a transição de fade
      await new Promise(resolve => setTimeout(resolve, 500)); // tempo da animação de fade
      setLoading(false); // Desative o carregamento após o fade
    };

    loadData();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/listMusic" element={<ListMusic />} />
          </Routes>
        )}
    </>
  );
};

export default App;