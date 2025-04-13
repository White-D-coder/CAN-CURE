
import React from 'react';
import Sidebar from '@/components/SideBar';
import CancerAnalyzer from '@/components/CancerAnalyzer';
import ConsultancyPanel from '@/components/ConsultancyPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <div className="w-full max-w-7xl mx-auto flex gap-6">
        <Sidebar />
        <div className="flex-1">
          <CancerAnalyzer />
        </div>
        <div className="w-[400px]">
          <ConsultancyPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;