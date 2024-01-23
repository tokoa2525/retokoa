import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('accessToken');
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'; // 管理者かどうかの状態を取得
      if (storedToken) {
        setUser({ accessToken: storedToken, isAdmin: storedIsAdmin });
      }
    }
  }, []);

  const login = ({ accessToken, isAdmin }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('isAdmin', isAdmin); // 管理者状態も保存
      setUser({ accessToken, isAdmin });
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isAdmin'); // 管理者状態も削除
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
