import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../../pages/login/login';
import RegisterPage from '../../pages/register/register';
import HomePage from '../../pages/home/HomePage';
import PrivateRoute from '../../context/PrivateRoute';
import SchedulePage from '../../pages/schedule/SchedulePage';
import ListMusic from '../../pages/listMusic/ListMusic';
import UsersCardsPage from '../../pages/users/users';
import MePage from '../../pages/me/me';

const MainRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
    <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
    <Route path="/listMusic" element={<PrivateRoute><ListMusic /></PrivateRoute>} />
    <Route path="/users" element={<PrivateRoute><UsersCardsPage /></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><MePage /></PrivateRoute>} />
    <Route path="*" element={<HomePage />} />
  </Routes>
);

export default MainRoutes;
