import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DoctorDashboard from '../../components/doctor/DoctorDashboard';

export default function DoctorPage() {
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-gray-100">
        <DoctorDashboard />
      </div>
    </ProtectedRoute>
  );
}
