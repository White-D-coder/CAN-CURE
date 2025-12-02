import axios from 'axios';

const API_URL = 'http://localhost:3000/api/doctors';

export const getDoctorAppointments = async (doctorId) => {
    const response = await axios.get(`${API_URL}/${doctorId}/appointments`);
    return response.data;
};

export const getPatientDetails = async (doctorId, patientId) => {
    const response = await axios.get(`${API_URL}/${doctorId}/patient/${patientId}`);
    return response.data;
};

export const addPrescription = async (doctorId, patientId, data) => {
    const response = await axios.post(`${API_URL}/${doctorId}/patient/${patientId}/prescription`, data);
    return response.data;
};

export const updatePrescription = async (doctorId, patientId, medId, data) => {
    const response = await axios.put(`${API_URL}/${doctorId}/patient/${patientId}/prescription/${medId}`, data);
    return response.data;
};
