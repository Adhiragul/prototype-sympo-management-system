import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eec_auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('eec_auth_token');
      const savedUser = localStorage.getItem('eec_user_info');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Verify with server in background
          const res = await authApi.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('eec_user_info', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('eec_auth_token', token);
        localStorage.setItem('eec_user_info', JSON.stringify(user));
        return { success: true, user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('eec_auth_token', token);
        localStorage.setItem('eec_user_info', JSON.stringify(user));
        return { success: true, user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check details.';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('eec_auth_token');
    localStorage.removeItem('eec_user_info');
  };

  // 1-Click Demo Account Switcher
  const quickDemoLogin = async (roleType) => {
    if (roleType === 'organizer') {
      return login('organizer@eec.srmrmp.edu.in', 'Admin@123');
    } else {
      return login('student@eec.srmrmp.edu.in', 'Student@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isOrganizer: user?.role === 'organizer' || user?.role === 'admin',
        login,
        register,
        logout,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
