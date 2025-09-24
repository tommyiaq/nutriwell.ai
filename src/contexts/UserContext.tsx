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
  const [skipSessionCheck, setSkipSessionCheck] = useState(false);

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
    // Check if we're coming from a logout (indicated by URL param or localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const isLoggedOut = urlParams.get('logged_out') === 'true' || 
                       localStorage.getItem('just_logged_out') === 'true';
    
    if (isLoggedOut) {
      // Clear the flag and skip session check
      localStorage.removeItem('just_logged_out');
      setUser(null);
      setIsLoading(false);
      setSkipSessionCheck(true);
    } else {
      // Normal session check
      refreshUserData();
    }
  }, []);

  const logout = () => {
    // Clear the user state first
    setUser(null);
    
    // Clear the session cookie
    clearSessionCookie();
    
    // Set flag to prevent session check on next load
    localStorage.setItem('just_logged_out', 'true');
    
    // Add a small delay to ensure cookie clearing completes before redirect
    setTimeout(() => {
      window.location.href = '/?logged_out=true';
    }, 100);
  };

  const isAuthenticated = user !== null && !isLoading;

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, isLoading, logout, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};
