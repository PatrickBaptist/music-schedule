import React, { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
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

const normalizeFirestoreUser = (user: Partial<User> & { id: string }): User => ({
  id: user.id,
  name: user.name || "Usuario Google",
  nickname: user.nickname || user.name || "Usuario Google",
  email: user.email || "",
  roles: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ["guest"],
  birthDate: user.birthDate,
  status: user.status || "pending",
  isOnline: user.isOnline,
  lastSeen: user.lastSeen,
  photoURL: user.photoURL,
  source: user.source,
});

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

  const fetchBackendUsers = async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar usuarios");
    }

    const data = (await res.json()) as User[];
    return data.map((user) => normalizeBackendUser({ ...user, source: "backend" }));
  };

  const fetchFirestoreUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((userDoc) => {
      const data = userDoc.data() as Partial<User>;
      return normalizeFirestoreUser({
        id: userDoc.id,
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        roles: data.roles,
        birthDate: data.birthDate,
        status: data.status,
        isOnline: data.isOnline,
        lastSeen: data.lastSeen,
        photoURL: data.photoURL,
        source: "firebase",
      });
    });
  };

  const fetchUsers = useCallback(async () => {
    try {
      const [backendUsers, firestoreUsers] = await Promise.all([
        fetchBackendUsers().catch(() => [] as User[]),
        fetchFirestoreUsers().catch(() => [] as User[]),
      ]);

      const mergedUsers = [...backendUsers, ...firestoreUsers].reduce<User[]>((acc, current) => {
        const currentEmail = current.email.toLowerCase();
        const existingIndex = acc.findIndex((item) => {
          const itemEmail = item.email.toLowerCase();
          return item.id === current.id || (itemEmail && currentEmail && itemEmail === currentEmail);
        });

        if (existingIndex >= 0) {
          acc[existingIndex] = { ...current, ...acc[existingIndex] };
        } else {
          acc.push(current);
        }

        return acc;
      }, []);

      setUsers(mergedUsers);
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
      return normalizeBackendUser(data);
    } catch {
      try {
        const userRef = doc(db, "users", id);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) return null;

        return normalizeFirestoreUser({
          id: snapshot.id,
          ...(snapshot.data() as Partial<User>),
          source: "firebase",
        });
      } catch (err) {
        console.error(err);
        return null;
      }
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
      try {
        const userRef = doc(db, "users", id);
        await setDoc(userRef, updated, { merge: true });
      } catch (firestoreErr) {
        console.error(firestoreErr);
        throw err;
      }
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
      try {
        const userRef = doc(db, "users", id);
        await deleteDoc(userRef);
      } catch (firestoreErr) {
        console.error(firestoreErr);
        throw err;
      }
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
