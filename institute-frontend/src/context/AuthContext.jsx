import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';
import { studentApi } from '../api/studentApi';
import { facultyApi } from '../api/facultyApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'student' | 'faculty'
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials, loginRole) => {
    let res;
    if (loginRole === 'admin') res = await adminApi.login(credentials);
    else if (loginRole === 'student') res = await studentApi.login(credentials);
    else if (loginRole === 'faculty') res = await facultyApi.login(credentials);

    const data = res.data;
    const jwt = data.access_token || data.token;
    const userData = data.admin || data.student || data.faculty || data.user || data;

    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', loginRole);

    setToken(jwt);
    setUser(userData);
    setRole(loginRole);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, setUser, role, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
