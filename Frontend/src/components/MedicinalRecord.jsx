import React, { useState } from 'react';
import { Upload, FileText, Calendar, Check, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const MedicinalRecord = ({ user }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ocrResult, setOcrResult] = useState(null);
    const [syncStatus, setSyncStatus] = useState(null); // 'success', 'error'

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
        formData.append('report', file);

        try {
            // Adjust URL if needed based on Vite proxy or direct URL
            const response = await axios.post('http://localhost:3000/api/medicinal/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setOcrResult(response.data);
        } catch (error) {
            console.error("Upload failed", error);
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

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    Upload Medical Report
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Section */}
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

                    {/* Results Section */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full flex flex-col">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-primary-600" />
                            Extracted Medicines
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            {ocrResult ? (
                                ocrResult.medicines.length > 0 ? (
                                    ocrResult.medicines.map((med, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900">{med.name}</p>
                                                <p className="text-xs text-gray-500">{med.dosage} • {med.timing}</p>
                                            </div>
                                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                Detected
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-10">
                                        No medicines detected. Please try a clearer image.
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
                </div>
            </div>
        </div>
    );
};

export default MedicinalRecord;
