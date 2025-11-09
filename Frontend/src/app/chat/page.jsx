import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ChatSystem from '../../components/chat/ChatSystem';

export default function ChatPage() {
  return (
    <ProtectedRoute allowedRoles={['user', 'doctor']}>
      <div className="min-h-screen bg-gray-100">
        <ChatSystem />
      </div>
    </ProtectedRoute>
  );
}
