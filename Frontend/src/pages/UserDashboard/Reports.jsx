import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientProfile } from '../../api/patient';

const Reports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchReports();
        }
    }, [user]);

    const fetchReports = async () => {
        try {
            const data = await getPatientProfile(user.id);
            setReports(data.prof.Reports || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading reports...</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Medical Reports</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Access and download your medical documents.</p>
                </div>
                <button className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Upload New Report
                </button>
            </div>
            <ul className="divide-y divide-gray-200">
                {reports.map((report) => (
                    <li key={report.reportId}>
                        <a href={report.reportUrl} className="block hover:bg-gray-50">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{report.reportName}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            PDF
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                            Uploaded on {new Date(report.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
                {reports.length === 0 && (
                    <li className="px-4 py-10 text-center text-gray-500">No reports available.</li>
                )}
            </ul>
        </div>
    );
};

export default Reports;
