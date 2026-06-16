import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cpUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('cpUser', JSON.stringify(userData));
    localStorage.setItem('cpToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cpUser');
    localStorage.removeItem('cpToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
