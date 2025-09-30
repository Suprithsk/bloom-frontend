import { AxiosError } from 'axios';
import apiClient from './apiService';
import { LoginFormData } from '@/types/auth';

export const login = async (credentials: LoginFormData) => {
    try {
        const response = await apiClient.post('/login/', credentials);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw new Error('Login failed');
    }
};


