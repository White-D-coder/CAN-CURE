import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientProfile } from '../../api/patient';

const Medications = () => {
    const { user } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchMedicines();
        }
    }, [user]);

    const fetchMedicines = async () => {
        try {
            const data = await getPatientProfile(user.id);
            setMedicines(data.prof.medicines || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching medicines:', err);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading medications...</div>;

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 bg-white">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Current Medications</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Track your active prescriptions and dosage.</p>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Medicine Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dosage
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Frequency
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {medicines.map((med) => {
                                    const isActive = new Date(med.endDate) > new Date();
                                    return (
                                        <tr key={med.medId}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{med.medName}</div>
                                                <div className="text-sm text-gray-500">{med.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{med.dose}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{med.frequency}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {isActive ? 'Active' : 'Completed'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {medicines.length === 0 && (
                            <div className="text-center py-10 text-gray-500">No medications found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Medications;
