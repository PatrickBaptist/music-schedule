import React, { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from "react";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";


export interface RegisterPayload {
  name: string;
  nickname?: string;
  email: string;
  birthDate: string;
  password: string;
  roles?: string[];
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
  birthDate?: string;
  roles?: string[];
  phone?: string;
  photoURL?: string;
  provider?: "backend";
  status?: string;
}

export interface UpdateMyProfilePayload {
  name?: string;
  nickname?: string;
  phone?: string;
  photoURL?: string;
  birthDate?: string;
}

type AuthSource = "backend" | null;

export interface GoogleAuthResult {
  message: string;
  token?: string;
  user?: User;
}

interface BackendAuthResponse {
  message?: string;
  token?: string;
  firebaseCustomToken?: string;
  user?: User;
  status?: string;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  authSource: AuthSource;
  isAuthReady: boolean;
  isFirebaseAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<GoogleAuthResult>;
  loginGuest: () => Promise<void>;
  logout: () => void;
  registerUser: (payload: RegisterPayload) => Promise<RegisterResponse>;
  verifyEmail: (token: string) => Promise<string>;
  resendEmailVerification: (email: string) => Promise<string>;
  updateMyProfile: (payload: UpdateMyProfilePayload) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthService = createContext<AuthContextProps | undefined>(undefined);

const getStoredAuthSource = (): AuthSource => {
  return localStorage.getItem("token") ? "backend" : null;
};

const isPendingUser = (data: { status?: string; user?: { status?: string } }) => {
  return data.status === "pending" || data.user?.status === "pending";
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);
  const [authSource, setAuthSource] = useState<AuthSource>(getStoredAuthSource());
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isFirebaseAuthReady, setIsFirebaseAuthReady] = useState(false);


  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;
  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsFirebaseAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const establishFirebaseSession = useCallback(async (firebaseCustomToken?: string) => {
    if (!firebaseCustomToken) {
      throw new Error("O servidor não retornou a credencial necessária para carregar as músicas.");
    }

    await setPersistence(auth, browserLocalPersistence);
    await signInWithCustomToken(auth, firebaseCustomToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthSource(null);
    setUser(null);
    void signOut(auth);
  }, []);

  const loadBackendUser = useCallback(
    async (currentToken: string) => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json() as User & { firebaseCustomToken?: string };

      if (auth.currentUser?.uid !== data.id && data.firebaseCustomToken) {
        await establishFirebaseSession(data.firebaseCustomToken);
      }

      setUser((current) => ({
        id: data.id,
        name: data.name ?? current?.name,
        nickname: data.nickname ?? current?.nickname,
        email: data.email ?? current?.email ?? "",
        birthDate: data.birthDate ?? current?.birthDate,
        roles: data.roles ?? current?.roles,
        phone: data.phone ?? current?.phone,
        photoURL: data.photoURL ?? current?.photoURL,
        provider: "backend",
        status: data.status ?? current?.status,
      }));
    },
    [API_URL, establishFirebaseSession, logout]
  );

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    await loadBackendUser(token);
  }, [loadBackendUser, token]);

  useEffect(() => {
    const init = async () => {
      try {
        if (token) {
          await refreshUser();
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    void init();
  }, [refreshUser, token]);

  const login = async (email: string, password: string) => {
    try {
      await signOut(auth);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData?.message || "Credenciais invalidas. Tente novamente.";
        throw new Error(errorMsg);
      }

      const data = await res.json() as BackendAuthResponse;

      if (!data.token) {
        throw new Error("O servidor não retornou uma sessão válida.");
      }

      await establishFirebaseSession(data.firebaseCustomToken);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthSource("backend");
      setUser(null);
      await loadBackendUser(data.token);
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<GoogleAuthResult> => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(true);

      try {
        const res = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await res.json().catch(() => ({})) as BackendAuthResponse;

        if (!res.ok || !data?.token) {
          throw new Error(data?.message || "Usuario nao pode logar agora");
        }

        if (isPendingUser(data)) {
          throw new Error("Seu cadastro ainda esta pendente. Aguarde a liberacao para entrar.");
        }

        await establishFirebaseSession(data.firebaseCustomToken);

        localStorage.setItem("token", data.token);
        setToken(data.token);
        setAuthSource("backend");

        if (data.user) {
          setUser({
            ...data.user,
            provider: "backend",
          });
        } else {
          await loadBackendUser(data.token);
        }

        return { message: data?.message || "Login realizado com sucesso.", token: data.token, user: data.user };
      } catch (error) {
        await signOut(auth).catch(() => undefined);
        throw error;
      }
    } catch (err) {
      console.error("Erro no login com Google:", err);
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
        throw new Error(data.message || "Erro ao cadastrar usuario");
      }

      return data;
    } catch (err) {
      console.error("Erro ao cadastrar usuario:", err);
      throw err;
    }
  };

  const verifyEmail = useCallback(async (verificationToken: string): Promise<string> => {
    const res = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: verificationToken }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Não foi possível confirmar seu e-mail.");
    return data.message || "E-mail confirmado. Seu cadastro foi concluído.";
  }, [API_URL]);

  const resendEmailVerification = useCallback(async (email: string): Promise<string> => {
    const res = await fetch(`${API_URL}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Não foi possível reenviar o link.");
    return data.message || "Se houver um cadastro pendente, enviaremos um novo link.";
  }, [API_URL]);

  const updateMyProfile = async (payload: UpdateMyProfilePayload) => {
    if (!token) {
      throw new Error("Sessao expirada");
    }

    const normalizedPayload = {
      name: payload.name?.trim(),
      nickname: payload.nickname?.trim(),
      phone: payload.phone?.trim(),
      photoURL: payload.photoURL?.trim(),
      birthDate: payload.birthDate?.trim(),
    };

    const filteredPayload = Object.fromEntries(
      Object.entries(normalizedPayload).filter(([, value]) => Boolean(value))
    );

    if (Object.keys(filteredPayload).length === 0) {
      throw new Error("Envie pelo menos um campo valido");
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

    setUser((current) => (current ? { ...current, ...normalizedPayload } : current));
    await refreshUser();
  };

  const loginGuest = async () => {
    try {
      await signOut(auth);
      const res = await fetch(`${API_URL}/auth/guest`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Erro ao entrar como convidado");
      }

      const data = await res.json() as BackendAuthResponse;

      if (!data.token) {
        throw new Error("O servidor não retornou uma sessão válida.");
      }

      await establishFirebaseSession(data.firebaseCustomToken);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthSource("backend");
      await loadBackendUser(data.token);
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  return (
    <AuthService.Provider
      value={{
        user,
        token,
        authSource,
        isAuthReady,
        isFirebaseAuthReady,
        login,
        loginWithGoogle,
        logout,
        registerUser,
        verifyEmail,
        resendEmailVerification,
        loginGuest,
        updateMyProfile,
        refreshUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthService.Provider>
  );
};
