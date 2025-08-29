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
import UsersPage from './pages/users/users';
import MePage from './pages/me/me';
import styled from 'styled-components';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
`;

const ConainterRoutes = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: #0e1e30ff;
    border-radius: 1em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #58a6ff;
    border-radius: 1em;
  }
`;

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
        position: "bottom-center",
        id: "update-toast",
      });
    }
  }, [updateAvailable]);

  return (
    <AppContainer>
      <Header />

      <ConainterRoutes>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
          <Route path="/listMusic" element={<PrivateRoute><ListMusic /></PrivateRoute>} />
          <Route path="/alter" element={<PrivateRoute><ScheduleForm /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><MePage /></PrivateRoute>} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ConainterRoutes>

      <Footer />
    </AppContainer>
  );
};

export default App;