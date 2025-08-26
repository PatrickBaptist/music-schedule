import { useContext } from "react";
import { AuthContextProps, AuthService } from "../../services/AuthService";

const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthService);
  if (!context) {
    throw new Error("useLoginContext precisa estar dentro de LoginProvider");
  }

  return context;
};

export default useAuthContext;
