"use client";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    specialization: '',
    licenseNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Add role-specific fields
    if (formData.role === 'doctor') {
      registrationData.specialization = formData.specialization;
      registrationData.licenseNumber = formData.licenseNumber;
    }

    const result = await register(registrationData);
    
    if (result.success) {
      alert(result.message || 'Registration successful! Please wait for admin approval if you registered as a doctor.');
      onClose();
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Register for CAN-CURE</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="user">Patient/User</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            
            {formData.role === 'doctor' && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium mb-1">
                    Specialization
                  </label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Oncology, Radiology"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
                    Medical License Number
                  </label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-blue-600 hover:underline"
              >
                Already have an account? Login here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterModal;
