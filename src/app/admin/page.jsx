import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AdminDashboard from '../../components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-100">
        <AdminDashboard />
      </div>
    </ProtectedRoute>
  );
}
