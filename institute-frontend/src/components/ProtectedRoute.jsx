import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0d0f1a]">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 animate-pulse" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;

  return children;
}
