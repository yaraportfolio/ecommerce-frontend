import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    isAdmin: isAdmin()
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
