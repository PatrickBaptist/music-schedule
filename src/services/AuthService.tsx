import React, { createContext, useState, useEffect, ReactNode } from "react";
import useUsersContext from "../context/hooks/useUsersContext";

export interface RegisterPayload {
  name: string;
  nickname?: string;
  email: string;
  birthDate: string;
  password: string;
  roles: string[];
  phone?: string;
  photoURL?: string;
  joinedAt?: string;
  instruments?: string[];
  experience?: string;
  notes?: string;
  canLeadWorship?: boolean;
}

interface RegisterResponse {
  message: string;
  id: string;
}

interface User {
  id: string;
  name?: string;
  nickname?: string;
  email: string;
  roles?: string[];
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (payload: RegisterPayload) => Promise<RegisterResponse>;
  isAuthenticated: boolean;
}

export const AuthService = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);
  const { setUserOnlineStatus } = useUsersContext();

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          logout();
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setUser({
          id: data.id,
          name: data.name,
          nickname: data.nickname,
          email: data.email,
          roles: data.roles,
        });
      } catch {
        logout();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, API_URL]);

  useEffect(() => {
  if (!user?.id) return;
    setUserOnlineStatus(user.id);
  }, [user?.id, setUserOnlineStatus]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && user?.id) {
        setUserOnlineStatus(user.id);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, [user?.id, setUserOnlineStatus]);



  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg =
          errorData?.message || "Credenciais inválidas. Tente novamente.";
        throw new Error(errorMsg);
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  const logout =() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erro ao cadastrar usuário");
    }

    return data;
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      throw err;
    }
  };

  return (
    <AuthService.Provider value={{ user, token, login, logout, registerUser, isAuthenticated: !!token }}>
      {children}
    </AuthService.Provider>
  );
};
