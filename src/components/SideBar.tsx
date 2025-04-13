
import React from 'react';
import { Home, BarChart2, Calendar, Mail, Search, User, FileText, Heart, Microscope, Pill, Users, FlaskRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, badge }) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors",
      active ? "bg-dna-light-purple" : "hover:bg-gray-100"
    )}>
      <div className={cn(
        "flex items-center justify-center w-6",
        active ? "text-dna-purple" : "text-gray-500"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm font-medium",
        active ? "text-dna-purple" : "text-gray-700"
      )}>
        {label}
      </span>
      {badge && (
        <div className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-dna-purple text-white text-xs">
          {badge}
        </div>
      )}
    </div>
  );
};

const ProfilePic: React.FC<{ src: string; className?: string }> = ({ src, className }) => (
  <div className={cn("w-6 h-6 rounded-full overflow-hidden", className)}>
    <img src={src} alt="Profile" className="w-full h-full object-cover" />
  </div>
);

const Sidebar: React.FC = () => {
  return (
    <div className="w-[240px] bg-white rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">CANCURE</h1>
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <Search className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="space-y-1">
        <SidebarItem icon={<Home size={20} />} label="Homepage" />
        <SidebarItem icon={<Microscope size={20} />} label="AI Analyzer" active />
        <SidebarItem icon={<FileText size={20} />} label="Treatments" />
        <SidebarItem icon={<Calendar size={20} />} label="Appointments" />
        <SidebarItem icon={<Mail size={20} />} label="Messages" badge={2} />
      </div>

      <div className="mt-6">
        <div className="text-xs font-medium text-gray-500 mb-4">Cancer Specialists</div>
        <div className="flex items-center mb-3">
          <div className="flex -space-x-2">
            <ProfilePic src="https://randomuser.me/api/portraits/women/44.jpg" />
            <ProfilePic src="https://randomuser.me/api/portraits/men/32.jpg" className="-ml-2" />
            <ProfilePic src="https://randomuser.me/api/portraits/women/60.jpg" className="-ml-2" />
          </div>
          <button className="ml-2 text-xs bg-black text-white py-1 px-3 rounded-full">
            Find Doctor
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-gray-500">Treatment Options</div>
          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-semibold mt-1">Cancer Analysis</h2>
      </div>

      <div className="space-y-1 mt-2">
        <SidebarItem icon={<div className="w-5 h-5 rounded-lg bg-dna-purple flex items-center justify-center"><Microscope size={14} className="text-white" /></div>} label="AI Scanner" active />
        <SidebarItem icon={<FlaskRound size={20} />} label="Lab Results" />
        <SidebarItem icon={<Pill size={20} />} label="Medications" />
        <SidebarItem icon={<Users size={20} />} label="Support Group" />
      </div>
    </div>
  );
};

export default Sidebar;