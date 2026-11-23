import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, LoginResponse } from "../types/auth";
import { api, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "../services/api";

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa o estado a partir do localStorage e valida token se existir
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Valida no backend se a sessão continua ativa
          try {
            const response = await api.get<{ id: string; name: string; email: string; role: User["role"] }>("/users/me");
            setUser(response.data);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
          } catch {
            // Em caso de falha de validação (ex: 401), limpa sessão
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
