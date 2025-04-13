"use client";
import React, { useState } from 'react';
import { MoreHorizontal, ArrowRight, Plus, Minus, RotateCw, RefreshCcw, Info, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CancerAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!query) {
      alert("Please enter your symptoms or concerns.");
      return;
    }

    setLoading(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      const responses = [
        "Based on the information provided, we recommend scheduling a consultation with our oncologists. Your symptoms suggest early-stage indicators that require professional evaluation.",
        "Our AI analysis indicates low risk factors, but we advise preventative screening as a precautionary measure. Would you like to schedule an appointment?",
        "The symptoms you've described match several treatable conditions. Our team can provide a more detailed analysis during a consultation. Shall we connect you with a specialist?",
        "Initial analysis suggests potential concerns that should be addressed promptly. We recommend immediate consultation with our oncology team.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAnalysisResult(randomResponse);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Cancer AI Analyzer</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full text-xs font-medium bg-dna-light-purple text-dna-purple active-tab">Symptoms</button>
          <button className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100">Scan</button>
          <button className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100">History</button>
        </div>
      </div>

      <div className="flex-grow relative flex flex-col justify-between">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">AI-Powered Cancer Analysis</h3>
          <p className="text-gray-600 mb-4">
            Describe your symptoms, medical history, or upload test results for our AI to analyze and provide preliminary insights.
          </p>
          
          <div className="bg-dna-light-purple rounded-xl p-4 mb-6">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-dna-purple flex items-center justify-center mr-3 flex-shrink-0">
                <Info size={16} className="text-white" />
              </div>
              <p className="text-sm text-gray-700">
                Our AI analyzer provides preliminary insights, not a medical diagnosis. Always consult with healthcare professionals for proper medical advice.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                Describe your symptoms or concerns
              </label>
              <div className="relative">
                <Input
                  id="symptoms"
                  placeholder="e.g., I've noticed unusual fatigue and a lump in my breast..."
                  className="pr-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-dna-purple hover:text-dna-dark-purple"
                  onClick={handleAnalyze}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-8 h-8 rounded-full border-2 border-dna-purple border-t-transparent animate-spin mb-2"></div>
            <p className="text-gray-600">Analyzing your information...</p>
          </div>
        )}

        {analysisResult && !loading && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Analysis Result:</h4>
            <p className="text-gray-700">{analysisResult}</p>
            
            <div className="mt-4 flex justify-end">
              <button className="bg-dna-purple text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                Book Consultation
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        
        <img 
          src="/lovable-uploads/0158e0b8-007c-4d6a-bef8-dd4160e4e4de.png" 
          alt="Cancer Cell Visualization" 
          className="w-full max-h-[200px] object-contain opacity-20 absolute top-1/2 left-0 -z-10"
        />
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

export default CancerAnalyzer;