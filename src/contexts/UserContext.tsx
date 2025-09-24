import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, clearSessionCookie, apiCall } from '../utils/api';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUserData: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Function to call WhoAmI endpoint for session recovery using apiCall helper
  type WhoAmIResponse = { user?: User };
  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const data = await apiCall<WhoAmIResponse>('/Services/WhoAmI.srv', {});
      if (data.status === 'ok' && data.data && data.data.user) {
        setUser(data.data.user);
      } else {
        // User is not authenticated or session expired
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    refreshUserData();
  }, []);

  const logout = () => {
    // Clear the user state
    setUser(null);
    
    // Clear the session cookie
    clearSessionCookie();
    
    // Redirect to home page
    window.location.href = '/';
  };

  const isAuthenticated = user !== null && !isLoading;

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, isLoading, logout, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};
