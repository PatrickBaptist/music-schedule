import React, { createContext, useState, ReactNode } from "react";

export interface MyContextType {
    openMenu: boolean;
    setOpenMenu: (value: boolean) => void;
}

const UserContext = createContext<MyContextType | undefined>(undefined);

export const UserStore: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    return (
        <UserContext.Provider value={{ openMenu, setOpenMenu }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
