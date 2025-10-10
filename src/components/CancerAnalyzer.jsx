"use client";
import React, { useState } from 'react';
import { MoreHorizontal, ArrowRight, Plus, Minus, RotateCw, RefreshCcw, Info, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CancerAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('symptoms');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleAnalyze = () => {
    if (activeTab === 'symptoms' && !query) {
      alert("Please enter your symptoms or concerns.");
      return;
    }

    if (activeTab === 'scan' && !uploadedImage) {
      alert("Please upload an image for analysis.");
      return;
    }

    setLoading(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      const responses = activeTab === 'scan' ? [
        "Image analysis complete. The scan shows potential areas of concern that require further evaluation. We recommend scheduling a consultation with our radiologists.",
        "Based on the image analysis, the findings appear to be within normal parameters. However, we suggest follow-up screening as recommended by your healthcare provider.",
        "The uploaded image has been processed. Initial analysis indicates some anomalies that warrant professional review. Please consult with our specialists.",
      ] : [
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoom = (direction) => {
    alert(`Zoom ${direction} functionality would be implemented here`);
  };

  const handleRotate = (direction) => {
    alert(`Rotate ${direction} functionality would be implemented here`);
  };

  const handleReset = () => {
    alert('Reset functionality would be implemented here');
  };

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Cancer AI Analyzer</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('symptoms')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'symptoms' 
                ? 'bg-dna-light-purple text-dna-purple' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Symptoms
          </button>
          <button 
            onClick={() => setActiveTab('scan')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'scan' 
                ? 'bg-dna-light-purple text-dna-purple' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Scan
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'history' 
                ? 'bg-dna-light-purple text-dna-purple' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            History
          </button>
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
            {activeTab === 'symptoms' && (
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
            )}

            {activeTab === 'scan' && (
              <div>
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload medical image for analysis
                </label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
                      ) : (
                        <div>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {uploadedImage && (
                    <button 
                      className="w-full bg-dna-purple text-white py-2 px-4 rounded-lg hover:bg-dna-dark-purple"
                      onClick={handleAnalyze}
                    >
                      Analyze Image
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Previous Analyses</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">Symptoms Analysis - Jan 15, 2024</h5>
                        <p className="text-sm text-gray-600">Fatigue and chest discomfort</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Low Risk</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">Image Analysis - Jan 10, 2024</h5>
                        <p className="text-sm text-gray-600">Chest X-ray scan</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Follow-up</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
          src="/histology-colors.jpg" 
          alt="Cancer Cell Visualization" 
          className="w-full max-h-[200px] object-contain opacity-20 absolute top-1/2 left-0 -z-10"
        />
      </div>
      
      <div className="flex justify-between mt-6">
        <div className="flex space-x-3">
          <button 
            onClick={() => handleZoom('out')}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            title="Zoom Out"
          >
            <Minus size={18} className="text-gray-500" />
          </button>
          <button 
            onClick={() => handleZoom('in')}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            title="Zoom In"
          >
            <Plus size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => handleRotate('clockwise')}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            title="Rotate Clockwise"
          >
            <RotateCw size={18} className="text-gray-500" />
          </button>
          <button 
            onClick={handleReset}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            title="Reset View"
          >
            <RefreshCcw size={18} className="text-gray-500" />
          </button>
          <button 
            onClick={() => alert('Image information and metadata would be displayed here')}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            title="Image Info"
          >
            <Info size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancerAnalyzer;
