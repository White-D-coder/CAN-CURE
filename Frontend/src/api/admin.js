import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin';

export const getSystemStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const getAllDoctors = async () => {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
};
