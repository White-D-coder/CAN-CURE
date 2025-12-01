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
