import { EditModel, Model } from "@/types/dashboard";
import apiClient from "./apiService";
import axios from "axios";

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

// Add to your API service
export const uploadImage = (formData: FormData) => {
  return axios.post(`${import.meta.env.VITE_API_TOOL_IMAGE_BASE_URL}/App/uploadImage2/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createLead = (formData: FormData) => {
  console.log('Creating lead with data:', formData);
  return apiClient.post('/lead/', formData);
};

export const getModels = () => {
  return apiClient.get('/model/');
};

export const createModel = (formData: FormData) => {
    return apiClient.post('/model/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const submitContactForm = (formData: FormData) => {
    return apiClient.post('/get-in-touch/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};