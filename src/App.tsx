import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/schedule" element={<SchedulePage />} />
    </Routes>
  );
};

export default App;