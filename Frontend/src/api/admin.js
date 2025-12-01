import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin';

export const getSystemStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
};

export const getAllDoctors = async () => {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
};

export const createDoctor = async (data) => {
    const response = await axios.post(`${API_URL}/doctors`, data);
    return response.data;
};

export const updateDoctor = async (id, data) => {
    const response = await axios.put(`${API_URL}/doctors/${id}`, data);
    return response.data;
};

export const deleteDoctor = async (id) => {
    const response = await axios.delete(`${API_URL}/doctors/${id}`);
    return response.data;
};

export const createPatient = async (data) => {
    const response = await axios.post(`${API_URL}/patients`, data);
    return response.data;
};

export const updatePatient = async (id, data) => {
    const response = await axios.put(`${API_URL}/patients/${id}`, data);
    return response.data;
};

export const deletePatient = async (id) => {
    const response = await axios.delete(`${API_URL}/patients/${id}`);
    return response.data;
};
