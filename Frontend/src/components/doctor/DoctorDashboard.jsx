"use client";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, FileText, MessageSquare, BarChart3, Settings, Bell } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const mockPatients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 45,
      stage: 'Stage 2',
      urgency: 'Medium',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-01',
      condition: 'Breast Cancer',
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 62,
      stage: 'Stage 3',
      urgency: 'High',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-25',
      condition: 'Lung Cancer',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      age: 38,
      stage: 'Stage 1',
      urgency: 'Low',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-15',
      condition: 'Ovarian Cancer',
    },
  ];

  const mockAppointments = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '09:00 AM',
      type: 'Follow-up',
      status: 'Confirmed',
    },
    {
      id: 2,
      patient: 'Michael Chen',
      time: '10:30 AM',
      type: 'Consultation',
      status: 'Pending',
    },
    {
      id: 3,
      patient: 'Emily Rodriguez',
      time: '02:00 PM',
      type: 'Treatment',
      status: 'Confirmed',
    },
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-blue-600">127</p>
          <p className="text-sm text-gray-600">+5 this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Appointments Today</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-600">3 remaining</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-purple-600">94%</p>
          <p className="text-sm text-gray-600">Last 6 months</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {mockPatients.slice(0, 3).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.condition}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(patient.urgency)}`}>
                  {patient.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            {mockAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">{appointment.time} - {appointment.type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Patient List</h3>
        <p className="text-sm text-gray-600">Sorted by cancer stage and urgency</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Visit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{patient.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.condition}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.stage}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(patient.urgency)}`}>
                    {patient.urgency}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.nextAppointment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-green-600 hover:text-green-900">Message</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
      <div className="text-center py-12 text-gray-500">
        Calendar component would be integrated here
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'patients': return renderPatients();
      case 'calendar': return renderCalendar();
      case 'reports': return <div className="bg-white p-6 rounded-lg shadow">Reports component</div>;
      case 'messages': return <div className="bg-white p-6 rounded-lg shadow">Messages component</div>;
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
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{user.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.specialization}</p>
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
                  activeTab === tab.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
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
                Welcome back, Dr. {user.name}
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
