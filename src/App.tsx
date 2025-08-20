import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/loading/LoadingScreen';
import useSchedulesContext from './context/hooks/useScheduleContext';
import HomePage from './pages/home/HomePage';
import SchedulePage from './pages/schedule/SchedulePage';
import ListMusic from './pages/listMusic/ListMusic';
import ScheduleForm from './pages/alterSchedule/AlterSchedule';
import { useServiceWorkerUpdate } from './context/hooks/useServiceWorkerUpdate';
import { toast } from 'sonner';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const {getScheduleForMonth} = useSchedulesContext();
  const updateAvailable = useServiceWorkerUpdate();

  const getTargetMonthAndYear = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const year = today.getFullYear();

  const lastDayOfMonth = new Date(year, currentMonth, 0).getDate();
  const daysLeftInMonth = lastDayOfMonth - today.getDate();

  let targetMonth = daysLeftInMonth <= 7 ? currentMonth + 1 : currentMonth;
  const targetYear = targetMonth > 12 ? year + 1 : year;

  if (targetMonth > 12) targetMonth = 1;

  return { targetMonth, targetYear };
};

const getFormattedMonth = (): string => {
  const { targetMonth, targetYear } = getTargetMonthAndYear();
  const formattedMonth = targetMonth.toString().padStart(2, "0");
  return `${formattedMonth}-${targetYear}`;
};

const currentMonth = getFormattedMonth();

useEffect(() => {
  const checkServer = async () => {
    setLoading(true);

    try {
      await getScheduleForMonth(currentMonth);
      toast.success('Servidor Funcionando!', { id: 'server-status' });
      setLoading(false);
    } catch (err) {
      console.warn("Servidor ainda não respondeu, tentando novamente...");
      toast('Servidor ainda não respondeu, tentando novamente...', { id: 'server-status' });
      setTimeout(checkServer, 3000);
    }
  };

  checkServer();
}, [getScheduleForMonth, currentMonth]);

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
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/listMusic" element={<ListMusic />} />
            <Route path="/alter" element={<ScheduleForm />} />
          </Routes>
        )}
    </>
  );
};

export default App;