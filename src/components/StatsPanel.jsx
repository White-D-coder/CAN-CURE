import React from 'react';
import { MoreHorizontal, ArrowRight, UserCircle, Zap } from 'lucide-react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} value
 * @property {string} label
 * @property {React.ReactNode} icon
 */

/**
 * @typedef {Object} TimelinePointProps
 * @property {boolean} [active]
 * @property {boolean} [top]
 */

/**
 * @typedef {Object} ResearchCardProps
 * @property {string} title
 * @property {string} date
 * @property {boolean} [arrow]
 */

const StatsCard = ({ value, label, icon }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-dna-light-purple flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
};

const HeartRateChart = () => {
  return (
    <div className="relative h-20">
      <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
        <path
          d="M0,40 C10,40 20,10 30,40 C40,70 50,10 60,40 C70,70 80,10 90,40 C100,70 110,10 120,40 C130,70 140,10 150,40 C160,70 170,10 180,40 C190,70 200,10 210,40 C220,70 230,10 240,40 C250,70 260,10 270,40 C280,70 290,10 300,40"
          fill="none"
          stroke="#7E69AB"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-dna-purple rounded-full"></div>
    </div>
  );
};

const TimelinePoint = ({ active, top }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-dna-purple' : 'bg-dna-light-purple'}`}>
        {active ? (
          <span className="text-white text-xs">1</span>
        ) : (
          <span className="text-dna-purple text-xs">2</span>
        )}
      </div>
      {!top && <div className="w-[1px] h-12 bg-dna-light-purple"></div>}
    </div>
  );
};

const ResearchCard = ({ title, date, arrow }) => {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>{date}</span>
        {arrow && <ArrowRight size={14} />}
      </div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
};

const StatsPanel = () => {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      {/* Header with profile */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-dna-purple flex items-center justify-center">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-semibold">Becca Kirby</div>
            <div className="text-xs text-gray-500">Designer, USA</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            <UserCircle size={15} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between gap-4 mb-8">
        <StatsCard 
          value="27" 
          label="Analyzed nucleotides" 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v20M17 5H7M20 12H4M17 19H7" stroke="#7E69AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>} 
        />
        <StatsCard 
          value="31" 
          label="Active treatments" 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v6m0 8v6M4 12h16" stroke="#7E69AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>} 
        />
      </div>

      {/* Heart rate */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-gray-500">Heart rate</div>
          <MoreHorizontal size={16} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Average rate</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-500">The count of heart pulsations is healthy for your pulse</p>
          <span className="text-xs text-dna-purple">Peak</span>
        </div>
        <HeartRateChart />
        <div className="text-5xl font-bold flex items-baseline">
          92 <span className="text-sm text-gray-500 ml-1">bpm</span>
        </div>
      </div>

      {/* Researches */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Researches</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">September 15, 2023</span>
            <button className="px-2 py-1 rounded-md border border-gray-200 text-gray-500">More</button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <TimelinePoint active top />
            <div className="h-8"></div>
            <TimelinePoint />
            <div className="h-8"></div>
            <TimelinePoint top={false} />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <ResearchCard title="Calculating the risk of disease" date="Sept 10" arrow />
            <div className="relative">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-dna-light-purple"></div>
              <button className="w-full flex items-center justify-between bg-dna-purple text-white p-4 rounded-xl">
                <span>Diagnose of genetic diseases</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <ResearchCard title="Patterns in heredity" date="Aug 24" />
              <ArrowRight size={16} className="mx-2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
