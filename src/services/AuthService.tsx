import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
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
  phone?: string;
}

export interface UpdateMyProfilePayload {
  name?: string;
  nickname?: string;
  phone?: string;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginGuest: () => Promise<void>;
  logout: () => void;
  registerUser: (payload: RegisterPayload) => Promise<RegisterResponse>;
  updateMyProfile: (payload: UpdateMyProfilePayload) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthService = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);
  const { setUserOnlineStatus } = useUsersContext();

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();

      setUser({
        id: data.id,
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        roles: data.roles,
        phone: data.phone,
      });
    } catch {
      logout();
    }
  }, [API_URL, logout, token]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

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

  const updateMyProfile = async (payload: UpdateMyProfilePayload) => {
    if (!token) {
      throw new Error("Sessão expirada");
    }

    const filteredPayload = Object.fromEntries(
      Object.entries({
        name: payload.name?.trim(),
        nickname: payload.nickname?.trim(),
        phone: payload.phone?.trim(),
      }).filter(([, value]) => Boolean(value))
    );

    if (Object.keys(filteredPayload).length === 0) {
      throw new Error("Envie pelo menos um campo válido");
    }

    const res = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filteredPayload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Erro ao atualizar seus dados");
    }

    await refreshUser();
  };

  const loginGuest = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/guest`, {
        method: "POST"
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Erro ao entrar como convidado");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  return (
    <AuthService.Provider value={{ user, token, login, logout, registerUser, loginGuest, updateMyProfile, refreshUser, isAuthenticated: !!token }}>
      {children}
    </AuthService.Provider>
  );
};
