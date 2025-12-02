import axios from './axios';

export const getPatientProfile = async (id) => {
    try {
        const response = await axios.get(`/users/profile/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        throw error;
    }
};
