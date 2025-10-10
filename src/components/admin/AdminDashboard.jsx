"use client";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, UserCheck, UserX, BarChart3, Settings, Bell, Mail, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'doctors', label: 'Manage Doctors', icon: Users },
    { id: 'patients', label: 'All Patients', icon: Users },
    { id: 'approvals', label: 'Pending Approvals', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'support', label: 'Support Tickets', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const mockDoctors = [
    {
      id: 1,
      name: 'Dr. Emily Richards',
      email: 'emily.richards@cancure.com',
      specialization: 'Oncology',
      licenseNumber: 'MD12345',
      approved: true,
      joinDate: '2024-01-15',
      patientsCount: 45,
      successRate: 96,
    },
    {
      id: 2,
      name: 'Dr. Robert Chen',
      email: 'robert.chen@cancure.com',
      specialization: 'Surgical Oncology',
      licenseNumber: 'MD67890',
      approved: false,
      joinDate: '2024-01-20',
      patientsCount: 0,
      successRate: 0,
    },
    {
      id: 3,
      name: 'Dr. Lisa Montgomery',
      email: 'lisa.montgomery@cancure.com',
      specialization: 'Radiation Oncology',
      licenseNumber: 'MD11111',
      approved: true,
      joinDate: '2024-01-10',
      patientsCount: 32,
      successRate: 94,
    },
  ];

  const mockPatients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      age: 45,
      condition: 'Breast Cancer',
      stage: 'Stage 2',
      doctor: 'Dr. Emily Richards',
      joinDate: '2024-01-15',
      subscription: 'Premium',
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      age: 62,
      condition: 'Lung Cancer',
      stage: 'Stage 3',
      doctor: 'Dr. Robert Chen',
      joinDate: '2024-01-10',
      subscription: 'Basic',
    },
  ];

  const mockSupportTickets = [
    {
      id: 1,
      subject: 'Unable to access appointment booking',
      user: 'Sarah Johnson',
      status: 'Open',
      priority: 'High',
      createdAt: '2024-01-20',
    },
    {
      id: 2,
      subject: 'Doctor approval request',
      user: 'Dr. Robert Chen',
      status: 'Pending',
      priority: 'Medium',
      createdAt: '2024-01-19',
    },
  ];

  const handleApproveDoctor = async (doctorId) => {
    // API call to approve doctor
    console.log('Approving doctor:', doctorId);
    // Send email with login credentials
    alert('Doctor approved! Login credentials have been sent via email.');
  };

  const handleRejectDoctor = async (doctorId) => {
    // API call to reject doctor
    console.log('Rejecting doctor:', doctorId);
    alert('Doctor application rejected.');
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This will revoke their login access.')) {
      // API call to delete doctor
      console.log('Deleting doctor:', doctorId);
      alert('Doctor deleted successfully.');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Doctors</h3>
          <p className="text-3xl font-bold text-blue-600">{mockDoctors.filter(d => d.approved).length}</p>
          <p className="text-sm text-gray-600">{mockDoctors.filter(d => !d.approved).length} pending</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-green-600">1,247</p>
          <p className="text-sm text-gray-600">+23 this week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-purple-600">94%</p>
          <p className="text-sm text-gray-600">System average</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Support Tickets</h3>
          <p className="text-3xl font-bold text-orange-600">{mockSupportTickets.length}</p>
          <p className="text-sm text-gray-600">{mockSupportTickets.filter(t => t.status === 'Open').length} open</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Pending Doctor Approvals</h3>
          <div className="space-y-3">
            {mockDoctors.filter(d => !d.approved).map((doctor) => (
              <div key={doctor.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveDoctor(doctor.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectDoctor(doctor.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Support Tickets</h3>
          <div className="space-y-3">
            {mockSupportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="text-sm text-gray-600">{ticket.user}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Manage Doctors</h3>
        <p className="text-sm text-gray-600">View and manage all doctors in the system</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockDoctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{doctor.name}</div>
                    <div className="text-sm text-gray-500">{doctor.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialization}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctor.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.patientsCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.successRate}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!doctor.approved ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveDoctor(doctor.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDoctor(doctor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">All Patients</h3>
        <p className="text-sm text-gray-600">View all patients and their details</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.condition}</div>
                  <div className="text-sm text-gray-500">{patient.stage}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.doctor}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.subscription === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {patient.subscription}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-green-600 hover:text-green-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'doctors': return renderDoctors();
      case 'patients': return renderPatients();
      case 'approvals': return <div className="bg-white p-6 rounded-lg shadow">Approvals component</div>;
      case 'analytics': return <div className="bg-white p-6 rounded-lg shadow">Analytics component</div>;
      case 'support': return <div className="bg-white p-6 rounded-lg shadow">Support tickets component</div>;
      case 'settings': return <div className="bg-white p-6 rounded-lg shadow">Settings component</div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">System Administrator</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                  activeTab === tab.id ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell size={20} />
              </button>
              <div className="text-sm text-gray-600">
                Welcome, Admin {user.name}
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
