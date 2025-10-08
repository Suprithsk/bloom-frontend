import apiClient from "./apiService";

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export const changePassword = (data: ChangePasswordData) => {
    return apiClient.post('/retailer-change-password/', data);
};

export const contactAdmin = (formData: FormData) => {
    return apiClient.post('/retailer-contactus/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};