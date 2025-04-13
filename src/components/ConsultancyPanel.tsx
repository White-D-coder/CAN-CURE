
import React from 'react';
import { MoreHorizontal, ArrowRight, UserCircle, Zap, Calendar, Clock, Phone, Video } from 'lucide-react';

const ConsultantCard: React.FC<{ name: string; specialty: string; image: string; available?: boolean }> = 
  ({ name, specialty, image, available = true }) => {
  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow">
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-xs text-gray-500">{specialty}</div>
      </div>
      <div className={`w-2 h-2 rounded-full ${available ? "bg-green-500" : "bg-gray-300"}`}></div>
    </div>
  );
};

const AppointmentCard: React.FC<{ type: string; date: string; time: string; doctor: string; isVideo?: boolean }> = 
  ({ type, date, time, doctor, isVideo = false }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium bg-dna-light-purple text-dna-purple px-2 py-1 rounded-full">
          {type}
        </span>
        <div className="flex items-center gap-1">
          {isVideo ? (
            <Video size={14} className="text-dna-purple" />
          ) : (
            <Phone size={14} className="text-dna-purple" />
          )}
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
      <h3 className="text-sm font-semibold mb-1">{doctor}</h3>
      <div className="flex items-center text-xs text-gray-500">
        <Calendar size={12} className="mr-1" />
        {date}
      </div>
    </div>
  );
};

const SurvivalRateChart: React.FC = () => {
  return (
    <div className="relative h-20">
      <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
        <path
          d="M0,60 C20,65 40,45 60,40 C80,35 100,20 120,15 C140,10 160,8 180,5 C200,2 220,0 240,0 C260,0 280,2 300,5"
          fill="none"
          stroke="#7E69AB"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute left-3/4 top-0 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-dna-purple rounded-full"></div>
    </div>
  );
};

const TimelinePoint: React.FC<{ active?: boolean; top?: boolean }> = ({ active, top }) => {
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

const ConsultancyPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      {/* Header with profile */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-dna-purple flex items-center justify-center">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-semibold">Sarah Johnson</div>
            <div className="text-xs text-gray-500">Patient, USA</div>
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

      {/* Oncologists */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Available Specialists</h3>
          <button className="text-xs text-dna-purple">View All</button>
        </div>
        <div className="space-y-2">
          <ConsultantCard 
            name="Dr. Emily Richards" 
            specialty="Oncologist, 15 yrs exp."
            image="https://randomuser.me/api/portraits/women/32.jpg"
          />
          <ConsultantCard 
            name="Dr. Robert Chen" 
            specialty="Surgical Oncologist"
            image="https://randomuser.me/api/portraits/men/44.jpg"
            available={false}
          />
          <ConsultantCard 
            name="Dr. Lisa Montgomery" 
            specialty="Radiation Oncologist"
            image="https://randomuser.me/api/portraits/women/68.jpg"
          />
        </div>
      </div>

      {/* Survival rate */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-500">Treatment Success Rate</div>
          <MoreHorizontal size={16} className="text-gray-400" />
        </div>
        <h3 className="text-base font-semibold mb-2">5-Year Survival</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-500">Early detection significantly improves survival rates</p>
          <span className="text-xs text-dna-purple">Current</span>
        </div>
        <SurvivalRateChart />
        <div className="text-3xl font-bold flex items-baseline">
          92% <span className="text-sm text-gray-500 ml-1">success</span>
        </div>
      </div>

      {/* Upcoming appointments */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Upcoming Consultations</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">This Week</span>
            <button className="px-2 py-1 rounded-md border border-gray-200 text-gray-500">More</button>
          </div>
        </div>

        <div className="space-y-3">
          <AppointmentCard
            type="Initial Consultation"
            date="Today, April 12"
            time="2:30 PM"
            doctor="Dr. Emily Richards"
            isVideo={true}
          />
          <AppointmentCard
            type="Follow-up"
            date="April 15, 2025"
            time="10:00 AM"
            doctor="Dr. Robert Chen"
          />
          <div className="pt-2">
            <button className="w-full bg-dna-light-purple text-dna-purple p-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
              Schedule New Consultation
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyPanel;