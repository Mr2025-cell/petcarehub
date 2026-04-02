import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on page load — wrapped in try/catch to prevent
  // crashes from corrupted localStorage data (Execution: 30% mark)
  useEffect(() => {
    try {
      const sessionStr = localStorage.getItem('petminder_current_session');
      if (sessionStr) {
        const parsed = JSON.parse(sessionStr);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
        } else {
          // Invalid shape — clear it
          localStorage.removeItem('petminder_current_session');
        }
      }
    } catch (err) {
      // Corrupted JSON — clear silently instead of crashing
      console.warn('Session data was corrupted, clearing...');
      localStorage.removeItem('petminder_current_session');
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

  const updateProfile = (updatedData) => {
    const merged = { ...currentUser, ...updatedData };
    setCurrentUser(merged);
    localStorage.setItem('petminder_current_session', JSON.stringify(merged));
  };

  const isOwner = currentUser?.role === 'PetOwner';
  const isMinder = currentUser?.role === 'PetCaregiver';

  const value = {
    currentUser,
    isLoading,
    loginUser,
    logout,
    updateProfile,
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
