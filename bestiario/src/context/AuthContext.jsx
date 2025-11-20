import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { user: loggedUser } = await auth.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
