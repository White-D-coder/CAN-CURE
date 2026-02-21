import React, { useState } from 'react';
import { Upload, FileText, Calendar, Check, AlertCircle, Loader, Activity, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const MedicinalRecord = ({ user }) => {
    const [activeTab, setActiveTab] = useState('prescription');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ocrResult, setOcrResult] = useState(null);
    const [syncStatus, setSyncStatus] = useState(null);

    // Risk Prediction State
    const [riskLoading, setRiskLoading] = useState(false);
    const [riskPrediction, setRiskPrediction] = useState(null);
    const [riskData, setRiskData] = useState({
        age: 45, hemoglobin: 12.5, wbc: 8000, platelets: 250000,
        tumor_size: 2.5, lymph_nodes_affected: 1, cancer_type: 'Breast',
        cancer_stage: 'Stage II', treatment_type: 'Surgery'
    });

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setOcrResult(null);
            setSyncStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file); // changed from 'report' to 'file' based on Part 2 instructions

        try {
            const response = await axios.post('http://localhost:3000/api/medicinal/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // The user wanted us to log this exact object
            console.log('Upload success:', response.data);
            setOcrResult(response.data);
        } catch (error) {
            console.error('Upload failed:', error.response?.data || error.message);
            alert("Failed to process report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!ocrResult?.medicines) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/medicinal/sync', {
                medicines: ocrResult.medicines,
                userEmail: user?.email
            });
            if (response.data.success) {
                setSyncStatus('success');
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Sync failed", error);
            setSyncStatus('error');
            alert("Failed to sync with calendar.");
        } finally {
            setLoading(false);
        }
    };

    const handleRiskPredict = async () => {
        setRiskLoading(true);
        try {
            // Ensuring numbers are correctly typed
            const payload = { ...riskData, age: Number(riskData.age), hemoglobin: Number(riskData.hemoglobin), wbc: Number(riskData.wbc), platelets: Number(riskData.platelets), tumor_size: Number(riskData.tumor_size), lymph_nodes_affected: Number(riskData.lymph_nodes_affected) };
            const response = await axios.post('http://localhost:3000/api/medicinal/risk', payload);
            setRiskPrediction(response.data);
        } catch (error) {
            console.error("Prediction failed", error);
            alert("Failed to predict risk.");
        } finally {
            setRiskLoading(false);
        }
    };

    const handleRiskInputChange = (e) => {
        const { name, value } = e.target;
        setRiskData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary-600" />
                        Smart Scans Hub
                    </h2>

                    <div className="flex bg-gray-100 p-1 rounded-xl w-max">
                        <button
                            onClick={() => setActiveTab('prescription')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'prescription' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Prescription Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('risk')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'risk' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Risk Prediction ML
                        </button>
                    </div>
                </div>

                {activeTab === 'prescription' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8">
                        {/* Prescription Scan View */}
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="report-upload"
                                />
                                <label htmlFor="report-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Click to upload report</p>
                                        <p className="text-sm text-gray-500">JPG, PNG, PDF</p>
                                    </div>
                                </label>
                            </div>

                            {preview && (
                                <div className="relative rounded-xl overflow-hidden border border-gray-100 h-64">
                                    <img src={preview} alt="Report Preview" className="w-full h-full object-contain bg-gray-50" />
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                            >
                                {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Scan & Extract Medicines'}
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full flex flex-col">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-primary-600" />
                                Extracted Medicines
                            </h3>

                            <div className="flex-1 overflow-y-auto space-y-3">
                                {ocrResult ? (
                                    ocrResult.medicines.length > 0 ? (
                                        ocrResult.medicines.map((med, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{med.name}</p>
                                                        <p className="text-xs text-gray-500">{med.dosage} • {med.timing}</p>
                                                    </div>
                                                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium shrink-0">
                                                        Detected
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t border-gray-100 mt-1">
                                                    <a
                                                        href={`https://www.google.com/search?q=${encodeURIComponent(med.name + ' medicine uses side effects alternatives')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors w-max"
                                                    >
                                                        <AlertCircle className="w-4 h-4" />
                                                        Search info & alternatives
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 py-10 font-medium text-lg">
                                            दवाई Mention नहीं है
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                                        <FileText className="w-12 h-12 mb-3 opacity-20" />
                                        <p>Upload and scan a report to see medicines here.</p>
                                    </div>
                                )}
                            </div>

                            {ocrResult && ocrResult.medicines.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleSync}
                                    disabled={loading || syncStatus === 'success'}
                                    className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${syncStatus === 'success'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {syncStatus === 'success' ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Synced to Calendar
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-5 h-5" />
                                            Sync to Google Calendar
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'risk' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8">
                        {/* ML Form View */}
                        <div className="space-y-6">
                            <p className="text-gray-600 text-sm">
                                Enter clinical parameters to predict survival risk using our advanced Machine Learning model.
                                In a real scenario, this data is extracted directly from aggregated blood and biopsy reports.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Age</label>
                                    <input type="number" name="age" value={riskData.age} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Hemoglobin (g/dL)</label>
                                    <input type="number" step="0.1" name="hemoglobin" value={riskData.hemoglobin} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">WBC Count</label>
                                    <input type="number" name="wbc" value={riskData.wbc} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Platelets</label>
                                    <input type="number" name="platelets" value={riskData.platelets} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Tumor Size (cm)</label>
                                    <input type="number" step="0.1" name="tumor_size" value={riskData.tumor_size} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Lymph Nodes</label>
                                    <input type="number" name="lymph_nodes_affected" value={riskData.lymph_nodes_affected} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Cancer Type</label>
                                    <select name="cancer_type" value={riskData.cancer_type} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm">
                                        <option value="Breast">Breast</option>
                                        <option value="Lung">Lung</option>
                                        <option value="Leukemia">Leukemia</option>
                                        <option value="Colon">Colon</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Cancer Stage</label>
                                    <select name="cancer_stage" value={riskData.cancer_stage} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm">
                                        <option value="Stage I">Stage I</option>
                                        <option value="Stage II">Stage II</option>
                                        <option value="Stage III">Stage III</option>
                                        <option value="Stage IV">Stage IV</option>
                                    </select>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <label className="text-xs font-semibold text-gray-700">Treatment Type</label>
                                    <select name="treatment_type" value={riskData.treatment_type} onChange={handleRiskInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm">
                                        <option value="Surgery">Surgery</option>
                                        <option value="Chemotherapy">Chemotherapy</option>
                                        <option value="Radiation">Radiation</option>
                                        <option value="Immunotherapy">Immunotherapy</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleRiskPredict}
                                disabled={riskLoading}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transition-all"
                            >
                                {riskLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Run ML Prediction Model'}
                            </button>
                        </div>

                        {/* ML Results View */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-indigo-100 h-full flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

                            <div className="z-10 flex flex-col h-full">
                                <h3 className="font-semibold text-gray-900 mb-8 flex items-center gap-2">
                                    <HeartPulse className="w-5 h-5 text-indigo-600" />
                                    Prediction Results
                                </h3>

                                {riskPrediction ? (
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-gray-500 font-medium">Survival Probability</p>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                                {(riskPrediction.survival_probability * 100).toFixed(1)}%
                                            </div>
                                        </div>

                                        <div className="w-full max-w-xs space-y-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                            <p className="text-sm font-medium text-gray-500">Risk Stratification Level</p>
                                            <div className={`px-4 py-2 rounded-lg font-bold text-lg inline-block
                                                ${riskPrediction.risk_level === 'LOW' ? 'bg-green-100 text-green-700' :
                                                    riskPrediction.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {riskPrediction.risk_level} RISK
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center text-gray-400 py-10 flex flex-col items-center justify-center flex-1">
                                        <Activity className="w-16 h-16 mb-4 opacity-20 text-indigo-600" />
                                        <p>Submit clinical data to generate AI risk assessment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MedicinalRecord;
