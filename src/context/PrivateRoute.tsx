import React from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/loading/LoadingScreen";
import useAuthContext from "./hooks/useAuthContext";
import { UserRole } from "../types/UserRole";
import useOrganizationContext from "./hooks/useOrganizationContext";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
  requireOrganization?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
  requireOrganization = true,
}) => {
  const { isAuthenticated, user, isAuthReady } = useAuthContext();
  const { activeOrganizationId, isOrganizationReady } = useOrganizationContext();

  if (!isAuthReady || (isAuthenticated && !isOrganizationReady)) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOrganization && !activeOrganizationId) {
    return <Navigate to="/organizations" replace />;
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
