import { useContext } from "react";
import UserContext, { MyContextType } from "../openMenuContext";

export const useUserContext = (): MyContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserStore");
    }
    return context;
};
