import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    const sessionStr = localStorage.getItem('petminder_current_session');
    if (sessionStr) {
      setCurrentUser(JSON.parse(sessionStr));
    }
    setIsLoading(false);
  }, []);

  const loginUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('petminder_current_session', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('petminder_current_session');
  };

  const isOwner = currentUser?.role === 'PetOwner';
  const isMinder = currentUser?.role === 'PetCaregiver';

  const value = {
    currentUser,
    isLoading,
    loginUser,
    logout,
    isAuthenticated: !!currentUser,
    isOwner,
    isMinder
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
