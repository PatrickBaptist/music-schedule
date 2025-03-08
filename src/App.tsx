import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ListMusic from './pages/ListMusic';
import LoadingScreen from './components/LoadingScreen';
import ScheduleForm from './pages/AlterSchedule';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
 
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
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
            <Route path="/alter" element={<ScheduleForm />} />
          </Routes>
        )}
    </>
  );
};

export default App;