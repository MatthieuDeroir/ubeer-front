import React, { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently }}>
      {children}
    </AuthContext.Provider>
  );
};
