import { EditModel, Model } from "@/types/dashboard";
import apiClient from "./apiService";

export const fetchDashboardData = () => apiClient.get("/dashboard/");
export const fetchModels = () => apiClient.get("/model/");
export const fetchLeads = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [
        {
            lead_id: 220,
            name: "sarthal",
            models: '[{"model_id":474,"model_title":"Pen_Sofa_Fabric","category":"SOFA","price":"120","quantity":1,"images":["http://api.replaci.com/media/model_uploaded_image/penn_swed_sofa_KU184QH.png"]}]',
            category: ["SOFA"],
            total_price: 120,
            phone_number: "9999999999",
            email: "sa",
            preview_Image: "",
            created_at: "22 September 2025",
            status: "COMPLETED",
        },
        {
            lead_id: 219,
            name: "suhani",
            models: '[{"model_id":526,"model_title":"MidCentury_Fabric_sofa","category":"SOFA","price":"9800","quantity":1,"images":["http://api.replaci.com/media/model_uploaded_image/1_z09i4r6.png"]}]',
            category: ["SOFA"],
            total_price: 9800,
            phone_number: "9999999999",
            email: "suhani@gmail.com",
            preview_Image: "",
            created_at: "02 September 2025",
            status: "COMPLETED",
        },
        {
            lead_id: 218,
            name: "Sanchit Bansal",
            models: '[{"model_id":523,"model_title":"Table_5","category":"TABLE","price":"7500","quantity":1,"images":["http://api.replaci.com/media/model_uploaded_image/207d2850-0edb-4a6e-886e-0601329eb4e3.png"]}]',
            category: ["TABLE"],
            total_price: 7500,
            phone_number: "9999857475",
            email: "",
            preview_Image: "",
            created_at: "02 September 2025",
            status: "COMPLETED",
        },
    ];
};
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
