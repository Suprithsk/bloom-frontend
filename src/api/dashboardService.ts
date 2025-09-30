import { EditModel, Model } from "@/types/dashboard";
import apiClient from "./apiService";

export const fetchDashboardData = () => apiClient.get("/dashboard/");
export const fetchModels = () => apiClient.get("/model/");
export const fetchLeads =  () => apiClient.get("/lead/");
export const fetchUserProfile = () => apiClient.get("/retailer-details/");
export const fetchNotifications = () => apiClient.get("/notifications/");
export const deleteModel = (modelId: number) => {
    return apiClient.delete(`/model/${modelId}/`);
};
export const editModel = (modelId: number, modelData: EditModel) => {
    return apiClient.put(`/model/${modelId}/`, modelData);
};
export const getAllCategories = () => apiClient.get("/categories/");

export const getProfileInfo = () => {
    return apiClient.get("/retailer-details/");
};

export const updateProfileInfo = (
    profileData: FormData,
    config: {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
) => {
    return apiClient.put("/retailer-details/", profileData, config);
};

export const getLeadDetails = (leadId: string) => {
    return apiClient.get(`/lead/${leadId}/`);
};

export const updateLeadDetails = (leadId: string, formData: FormData) => {
    return apiClient.put(`/lead/${leadId}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteLeadById = (leadId: string) => {
    return apiClient.delete(`/lead/${leadId}/`);
};