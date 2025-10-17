import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface User {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  roles: string[];
  birthDate?: string;
  status?: string;
  isOnline?: boolean;
  lastSeen?: string;

}

export interface UsersContextProps {
  users: User[];
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (id: string, updated: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setUserOnlineStatus: (id: string, isOnline: boolean) => Promise<void>;
  listenUserStatus: (id: string, callback: (user: Partial<User>) => void) => () => void;
}

export const UsersService = createContext<UsersContextProps | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao buscar usuários");

      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [API_URL]);

  const getUserById = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Usuário não encontrado");
      const data: User = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateUser = async (id: string, updated: Partial<User>) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Erro ao atualizar usuário");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao deletar usuário");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setUserOnlineStatus = async (id: string, isOnline: boolean) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        isOnline,
        lastSeen: serverTimestamp(),
      });
    } catch (err) {
      console.error("Erro ao atualizar status online:", err);
    }
  };

  const listenUserStatus = (id: string, callback: (user: Partial<User>) => void) => {
    const userRef = doc(db, "users", id);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data() as Partial<User>);
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UsersService.Provider value={{ users, fetchUsers, getUserById, updateUser, deleteUser, setUserOnlineStatus, listenUserStatus }}>
      {children}
    </UsersService.Provider>
  );
};
