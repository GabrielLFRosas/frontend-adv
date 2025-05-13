import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function AuthLayout({ children, isAuthenticated }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <>{children}</> : <div>Redirecionando...</div>;
}