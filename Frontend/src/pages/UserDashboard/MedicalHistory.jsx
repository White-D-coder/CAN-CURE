import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientProfile } from '../../api/patient';

const MedicalHistory = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const data = await getPatientProfile(user.id);
            setHistory(data.prof.CancerType || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching history:', err);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading medical history...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Diagnosis Information</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Detailed records of your diagnosis and current stage.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        {history.length > 0 ? (
                            <div className="space-y-6">
                                {history.map((record, index) => (
                                    <div key={index} className="border-t border-gray-200 pt-4 first:border-0 first:pt-0">
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Condition</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{record.name}</dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Stage</dt>
                                                <dd className="mt-1 text-sm text-gray-900">Stage {record.stage}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{record.description}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Symptoms</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{record.symptoms}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Current Treatments</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{record.treatments}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No medical history records found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalHistory;
