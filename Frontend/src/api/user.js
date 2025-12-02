import api from './axios';

export const getDashboardData = async () => {
    try {
        const response = await api.get('/api/user/dashboard');
        return response.data;
    } catch (error) {
        throw error;
    }
};
