import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../context/PrivateRoute';
import { UserRole } from '../../types/UserRole';
import LoadingScreen from '../loading/LoadingScreen';

const LoginPage = lazy(() => import('../../pages/login/login'));
const RegisterPage = lazy(() => import('../../pages/register/register'));
const HomePage = lazy(() => import('../../pages/home/HomePage'));
const SchedulePage = lazy(() => import('../../pages/schedule/SchedulePage'));
const ListMusic = lazy(() => import('../../pages/listMusic/ListMusic'));
const UsersCardsPage = lazy(() => import('../../pages/users/users'));
const MePage = lazy(() => import('../../pages/me/me'));
const AuditPage = lazy(() => import('../../pages/audit/audit'));
const MySchedulePage = lazy(() => import('../../pages/mySchedule/MySchedulePage'));
const OrganizationSelectionPage = lazy(() => import('../../pages/organizations/OrganizationSelectionPage'));
const InvitationPage = lazy(() => import('../../pages/organizations/InvitationPage'));
const OrganizationManagementPage = lazy(() => import('../../pages/organizations/OrganizationManagementPage'));
const VerifyEmailPage = lazy(() => import('../../pages/register/VerifyEmailPage'));
const OwnershipTransferPage = lazy(() => import('../../pages/organizations/OwnershipTransferPage'));

const MainRoutes: React.FC = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/ownership-transfer" element={<OwnershipTransferPage />} />
      <Route path="/invite/:organizationSlug/:token" element={<InvitationPage />} />
      <Route path="/organization-settings" element={<PrivateRoute><OrganizationManagementPage /></PrivateRoute>} />
      <Route
        path="/organizations"
        element={<PrivateRoute requireOrganization={false}><OrganizationSelectionPage /></PrivateRoute>}
      />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
      <Route path="/listMusic" element={<PrivateRoute><ListMusic /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><UsersCardsPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><MePage /></PrivateRoute>} />
      <Route path="/my-schedule" element={<PrivateRoute><MySchedulePage /></PrivateRoute>} />
      <Route
        path="/audit"
        element={<PrivateRoute allowedRoles={[UserRole.Admin, UserRole.Leader]}><AuditPage /></PrivateRoute>}
      />
      <Route path="*" element={<PrivateRoute><HomePage /></PrivateRoute>} />
    </Routes>
  </Suspense>
);

export default MainRoutes;
