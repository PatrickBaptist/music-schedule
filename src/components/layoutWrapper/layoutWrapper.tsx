import { ReactNode } from "react";
import useAuthContext from "../../context/hooks/useAuthContext";
import Notification from "../notification/Notification";

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      {isAuthenticated && <Notification />}
      {children}
    </>
  );
};

export default LayoutWrapper;
