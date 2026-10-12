import React, { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import type { Timestamp } from "firebase/firestore";
import useOrganizationContext from "../context/hooks/useOrganizationContext";

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
  source?: "backend" | "firebase";
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

const normalizeBackendUser = (user: Partial<User> & { id: string }): User => ({
  id: user.id,
  name: user.name || "Usuario",
  nickname: user.nickname || user.name || "Usuario",
  email: user.email || "",
  roles: Array.isArray(user.roles) ? user.roles : [],
  birthDate: user.birthDate,
  status: user.status,
  isOnline: user.isOnline,
  lastSeen: user.lastSeen,
  photoURL: user.photoURL,
  source: user.source,
});

const stripSensitiveFields = <T extends Record<string, unknown>>(user: T) => {
  const { password, passwordHash, ...safeUser } = user as T & {
    password?: unknown;
    passwordHash?: unknown;
  };

  return safeUser;
};

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { activeOrganizationId, refreshOrganizations } = useOrganizationContext();
  const API_URL = `${import.meta.env.VITE_API_URL_PRODUTION}/organizations/${activeOrganizationId}`;

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchBackendUsers = async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar usuarios");
    }

    const data = (await res.json()) as Array<Record<string, unknown> & { id: string }>;
    return data.map((user) => normalizeBackendUser({ ...stripSensitiveFields(user), id: user.id, source: "backend" }));
  };

  const fetchUsers = useCallback(async () => {
    if (!activeOrganizationId) { setUsers([]); return; }
    try {
      const backendUsers = await fetchBackendUsers();
      setUsers(backendUsers);
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
      const data = (await res.json()) as Record<string, unknown> & { id: string };
      return normalizeBackendUser({ ...stripSensitiveFields(data), id: data.id, source: "backend" });
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateUser = async (id: string, updated: Partial<User>) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar usuario");
    }
    await refreshOrganizations();
  };

  const deleteUser = async (id: string) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error("Erro ao deletar usuario");
    }
  };

  const setUserOnlineStatus = useCallback(async (_id: string) => {
    if (!activeOrganizationId) return;
    await fetch(`${API_URL}/users/me/presence`, { method: "POST", headers: getHeaders() });
  }, [API_URL, activeOrganizationId]);

  return (
    <UsersService.Provider value={{ users, fetchUsers, getUserById, updateUser, deleteUser, setUserOnlineStatus }}>
      {children}
    </UsersService.Provider>
  );
};
