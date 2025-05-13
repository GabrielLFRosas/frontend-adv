import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'types';
import api from 'services/api';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: any | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('adv-token');
      const userData = localStorage.getItem('adv-user');

      if (token && userData) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          if(router.pathname === '/login') {
            router.push('/');
          }
        } catch (err) {
          console.error('Erro ao validar sessão:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('adv-token', token);
    localStorage.setItem('adv-user', JSON.stringify(user));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('adv-token');
    localStorage.removeItem('adv-user');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};