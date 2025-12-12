import api from './axios';

export const getDashboardData = async () => {
    try {
        const response = await api.get('/api/user/dashboard');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDoctors = async () => {
    try {
        const response = await api.get('/api/user/doctors');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const bookAppointment = async (appointmentData) => {
    try {
        const response = await api.post('/api/user/book-appointment', appointmentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDoctorAvailability = async (doctorId, date) => {
    try {
        const response = await api.get(`/api/user/availability?doctorId=${doctorId}&date=${date}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
