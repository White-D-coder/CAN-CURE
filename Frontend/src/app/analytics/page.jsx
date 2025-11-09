"use client";
import React from 'react';
import { Footer } from '../../components/Footer';
import RealtimeLineGraph from '../../components/charts/RealtimeLineGraph';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and analytics for cancer treatment data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RealtimeLineGraph 
            title="Treatment Success Rate"
            maxDataPoints={30}
            updateInterval={3000}
            dataRange={{ min: 85, max: 98 }}
          />
          
          <RealtimeLineGraph 
            title="Patient Satisfaction Score"
            maxDataPoints={40}
            updateInterval={2500}
            dataRange={{ min: 4.0, max: 5.0 }}
          />
          
          <RealtimeLineGraph 
            title="Daily Appointments"
            maxDataPoints={20}
            updateInterval={5000}
            dataRange={{ min: 0, max: 50 }}
          />
          
          <RealtimeLineGraph 
            title="System Performance"
            maxDataPoints={25}
            updateInterval={2000}
            dataRange={{ min: 90, max: 100 }}
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">94.2%</div>
              <div className="text-sm text-gray-600">Overall Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.8/5</div>
              <div className="text-sm text-gray-600">Patient Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">98.5%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
