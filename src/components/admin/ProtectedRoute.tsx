import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminUser } from '../../types/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  adminUser: AdminUser | null;
  isLoading: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminUser, isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};
