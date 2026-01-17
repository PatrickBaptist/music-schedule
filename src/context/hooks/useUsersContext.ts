import { useContext } from "react";
import { UsersService } from "../../services/UsersService";

const useUsersContext = ()  => {
   const context = useContext(UsersService);
  if (!context) {
    throw new Error('useUsersContext must be used within a UsersProvider');
  }
  return context;
};

export default useUsersContext;
