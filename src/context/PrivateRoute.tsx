import React from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/loading/LoadingScreen";
import useAuthContext from "./hooks/useAuthContext";
import { UserRole } from "../types/UserRole";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isAuthReady } = useAuthContext();

  if (!isAuthReady && !isAuthenticated) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user) {
      return <LoadingScreen />;
    }

    const hasAccess = user?.roles?.some((role) => allowedRoles.includes(role as UserRole));

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
