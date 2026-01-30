import { useContext } from "react";
import { ServerContext, ServerContextProps } from "../../services/wakeUpService";

const useServerContext = (): ServerContextProps => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServerContext precisa estar dentro de ServerProvider");
  }

  return context;
};

export default useServerContext;