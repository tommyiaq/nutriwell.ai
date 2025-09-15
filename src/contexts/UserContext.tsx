import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, clearSessionCookie } from '../utils/api';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    // Clear the user state
    setUser(null);
    
    // Clear the session cookie
    clearSessionCookie();
    
    // Redirect to home page
    window.location.href = '/';
  };

  const isAuthenticated = user !== null;

  // Check for existing session on mount (optional enhancement)
  React.useEffect(() => {
    // Check if we have a session cookie
    const hasSessionCookie = document.cookie.includes('.NutriWellBackend.Session');
    
    if (hasSessionCookie && !user) {
      // Future enhancement: call a "whoami" endpoint to get user data from session
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};
