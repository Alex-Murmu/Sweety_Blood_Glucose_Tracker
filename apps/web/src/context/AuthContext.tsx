import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api.ts";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  signin: (data: { email: string; password: string }) => Promise<void>;
  signout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const data = await api.me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadUser();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      const res = await api.signup(data);
      setUser(res.user);
    },
    []
  );

  const signin = useCallback(
    async (data: { email: string; password: string }) => {
      const res = await api.login(data);
      setUser(res.user);
    },
    []
  );

  const signout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const value = { user, loading, register, signin, signout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
