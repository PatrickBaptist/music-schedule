import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import SchedulePage from './pages/schedule/SchedulePage';
import ListMusic from './pages/listMusic/ListMusic';
import ScheduleForm from './pages/alterSchedule/AlterSchedule';
import { useServiceWorkerUpdate } from './context/hooks/useServiceWorkerUpdate';
import { toast } from 'sonner';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import PrivateRoute from './context/PrivateRoute';

const App: React.FC = () => {
  const updateAvailable = useServiceWorkerUpdate();

const handleUpdate = () => {
  window.location.reload(); // recarrega para pegar nova versão
};

useEffect(() => {
    if (updateAvailable) {
      toast("Nova versão disponível!", {
        action: {
          label: "Atualizar",
          onClick: handleUpdate,
        },
        duration: 10000,
        richColors: true,
        position: "bottom-center", // fixa no centro inferior
        id: "update-toast",
      });
    }
  }, [updateAvailable]);

  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
        <Route path="/listMusic" element={<PrivateRoute><ListMusic /></PrivateRoute>} />
        <Route path="/alter" element={<PrivateRoute><ScheduleForm /></PrivateRoute>} />
      </Routes>
  );
};

export default App;