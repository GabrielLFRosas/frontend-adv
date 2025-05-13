import { useRouter } from 'next/router';
import { useAuth } from 'contexts/AuthContext';
import { User } from 'types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    logout();
    router.push('/login');
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    router.push('/');
    return null;
  }

  return <>{children}</>;
}