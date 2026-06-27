import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
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
  lastSeen?: Timestamp | string;
  photoURL?: string;
}

export interface UsersContextProps {
  users: User[];
  fetchUsers: () => void;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (id: string, updated: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setUserOnlineStatus: (id: string) => Promise<void>;
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

      if (!res.ok) throw new Error("Erro ao buscar usuarios");

      const data = (await res.json()) as User[];
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getUserById = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Usuario nao encontrado");
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
      if (!res.ok) throw new Error("Erro ao atualizar usuario");
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
      if (!res.ok) throw new Error("Erro ao deletar usuario");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const setUserOnlineStatus = useCallback(async (id: string) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
      lastSeen: serverTimestamp(),
    });
  }, []);

  return (
    <UsersService.Provider value={{ users, fetchUsers, getUserById, updateUser, deleteUser, setUserOnlineStatus }}>
      {children}
    </UsersService.Provider>
  );
};
