import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user database - in production, this would be a backend
  const validUsers = {
    admin: { password: 'admin123', role: 'admin', name: 'Administrator' },
    accountant: { password: 'accountant123', role: 'accountant', name: 'Accountant' },
    teacher: { password: 'teacher123', role: 'teacher', name: 'Teacher' },
    parent: { password: 'parent123', role: 'parent', name: 'Parent' }
  };

  const login = (username, password) => {
    const userData = validUsers[username];
    if (userData && userData.password === password) {
      setUser({
        username,
        role: userData.role,
        name: userData.name
      });
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
