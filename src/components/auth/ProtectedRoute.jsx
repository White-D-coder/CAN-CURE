"use client";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

/**
 * @typedef {Object} ProtectedRouteProps
 * @property {React.ReactNode} children
 * @property {string[]} [allowedRoles]
 * @property {boolean} [requireAuth]
 */

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // If auth is not required, show content
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, show auth modal
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please login or register to access this page.</p>
            <div className="space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
        
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
        
        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </>
    );
  }

  // If roles are specified and user doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required roles: {allowedRoles.join(', ')}
            <br />
            Your role: {user.role}
          </p>
        </div>
      </div>
    );
  }

  // If doctor role but not approved
  if (user.role === 'doctor' && !user.approved) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your doctor account is pending admin approval. You will be notified once approved.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
