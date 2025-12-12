import api from './axios';

export const getDoctorAppointments = async (doctorId) => {
    const response = await api.get(`/api/doctors/${doctorId}/appointments`);
    return response.data;
};

export const getPatientDetails = async (doctorId, patientId) => {
    const response = await api.get(`/api/doctors/${doctorId}/patient/${patientId}`);
    return response.data;
};

export const addPrescription = async (doctorId, patientId, data) => {
    const response = await api.post(`/api/doctors/${doctorId}/patient/${patientId}/prescription`, data);
    return response.data;
};

export const updatePrescription = async (doctorId, patientId, medId, data) => {
    const response = await api.put(`/api/doctors/${doctorId}/patient/${patientId}/prescription/${medId}`, data);
    return response.data;
};

export const addReport = async (data) => {
    const response = await api.post(`/api/reports`, data);
    return response.data;
};

export const updateReport = async (reportId, data) => {
    const response = await api.patch(`/api/reports/${reportId}`, data);
    return response.data;
};

export const getDoctorSlots = async (doctorId, date) => {
    const response = await api.get(`/api/doctors/schedule?doctorId=${doctorId}&date=${date}`);
    return response.data;
};

export const approveSlot = async (slotId) => {
    const response = await api.put(`/api/doctors/schedule/approve`, { slotId });
    return response.data;
};
