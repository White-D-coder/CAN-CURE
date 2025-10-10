import React from 'react';
import { MoreHorizontal, ArrowRight, Plus, Minus, RotateCw, RefreshCcw, Info } from 'lucide-react';

const DnaOverview = () => {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">DNA Overview</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full text-xs font-medium bg-dna-light-purple text-dna-purple active-tab">Day</button>
          <button className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100">Week</button>
          <button className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100">Month</button>
        </div>
      </div>

      <div className="flex-grow relative flex justify-center items-center">
        <img 
          src="/histology-colors.jpg" 
          alt="DNA Visualization" 
          className="w-full h-full object-contain max-h-[400px]"
        />
        
        <div className="absolute bottom-24 left-0">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Good <br/>interaction <br/>with other <br/>molecules</h3>
            <button className="bg-dna-purple text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              Learn more
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <div className="flex space-x-3">
          <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            <Minus size={18} className="text-gray-500" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            <Plus size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            <RotateCw size={18} className="text-gray-500" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            <RefreshCcw size={18} className="text-gray-500" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            <Info size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DnaOverview;
