import { useEffect } from "react";
import useAuthContext from "./useAuthContext";
import useUsersContext from "./useUsersContext";

export const useUserPresence = () => {
  const { user } = useAuthContext();
  const { setUserOnlineStatus } = useUsersContext();
  useEffect(() => {
    if (!user?.id) return;
    const update = () => {
      if (document.visibilityState === "visible") void setUserOnlineStatus(user.id).catch(() => undefined);
    };
    update();
    const timer = window.setInterval(update, 120000);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, [user?.id, setUserOnlineStatus]);
};
