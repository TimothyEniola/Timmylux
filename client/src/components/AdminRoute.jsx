import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) return null;

  // 1. If not logged in at all, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
    toast.error("You do not have permission to access the admin panel.");
    return <Navigate to="/" replace />;
  }

  return children;
}