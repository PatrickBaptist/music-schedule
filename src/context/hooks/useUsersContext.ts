import { useContext } from "react";
import { UsersService } from "../../services/UsersService";

const useUsersContext = ()  => {
   const context = useContext(UsersService);
  if (!context) {
    throw new Error('useMusicLinksContext must be used within a MusicLinksProvider');
  }
  return context;
};

export default useUsersContext;
