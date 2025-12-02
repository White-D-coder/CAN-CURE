import axios from './axios';

export const getDoctorAppointments = async (doctorId) => {
    const response = await axios.get(`/doctors/${doctorId}/appointments`);
    return response.data;
};

export const getPatientDetails = async (doctorId, patientId) => {
    const response = await axios.get(`/doctors/${doctorId}/patient/${patientId}`);
    return response.data;
};
