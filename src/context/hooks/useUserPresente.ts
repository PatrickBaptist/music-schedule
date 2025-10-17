import { useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import useAuthContext from "./useAuthContext";

export const useUserPresence = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.id) return;

    const userRef = doc(db, "users", user.id);

    const setOnline = async () => {
      await updateDoc(userRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      });
    };

    const setOffline = async () => {
      await updateDoc(userRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    };

    setOnline();

    window.addEventListener("beforeunload", setOffline);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") setOffline();
      else setOnline();
    });

    return () => {
      setOffline();
      window.removeEventListener("beforeunload", setOffline);
    };
  }, [user]);
};
