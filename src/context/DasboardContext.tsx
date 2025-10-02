import { createContext, FC, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
    fetchDashboardData,
    fetchModels,
    fetchLeads,
    fetchUserProfile,
    deleteModel,
    editModel,
    deleteLeadById,
    updateLeadDetails,
    createLead,
} from "@/api/dashboardService";
import {
    DashboardResponse,
    EditModel,
    Lead,
    Model,
    ModelsResponse,
    UserProfile,
} from "@/types/dashboard";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
interface ErrorValue extends Error {
    response?: {
        status: number;
        data: {
            message?: string;
        };
    };
}

interface DashboardContextType {
    dashboardData: DashboardResponse | undefined;
    models: Model[] | [];
    leads: Lead[] | [];
    userProfile: UserProfile | undefined;
    isLoading: boolean;
    error: ErrorValue | null;
    modelsDataList: Model[] | undefined;
    modelsData: AxiosResponse<ModelsResponse, ModelsResponse> | undefined;
    // Add model operations
    deleteModelMutation: (modelId: number) => void;
    editModelMutation: (data: {
        modelId: number;
        modelData: EditModel;
    }) => void;
    isDeleting: boolean;
    isEditing: boolean;
    deleteLeadMutation: (leadId: string) => void;
    editLeadMutation: (data: { leadId: string; formData: FormData }) => void;
    createLeadMutation: (formData: FormData) => void;
}

interface DashboardProviderProps {
    children: React.ReactNode;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

export const DashboardProvider: FC<DashboardProviderProps> = ({ children }) => {
    const [modelsState, setModelsState] = useState<Model[]>([]);
    const location = useLocation();
    const queryClient = useQueryClient();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token && location.pathname !== "/") {
            queryClient.clear();
            return;
        }

        if (token && location.pathname !== "/") {
            const sampleCalling = async () => {
                try {
                    const dashboardData = await fetchDashboardData();
                    console.log(dashboardData);
                } catch (err) {
                    if (err.response?.status === 401) {
                        queryClient.clear();
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }
                }
            };
            sampleCalling();
            queryClient.invalidateQueries();
        }
    }, [location.pathname, queryClient]);

    // Existing queries
    const {
        data: dashboardData,
        isLoading: dashLoading,
        error: dashError,
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: fetchDashboardData,
    });

    const {
        data: modelsData,
        isLoading: modelsLoading,
        error: modelsError,
    } = useQuery({
        queryKey: ["models"],
        queryFn: fetchModels,
    });

    const {
        data: leadsData,
        isLoading: leadsLoading,
        error: leadsError,
    } = useQuery({
        queryKey: ["leads"],
        queryFn: fetchLeads,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: profileData,
        isLoading: profileLoading,
        error: profileError,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchUserProfile,
    });

    // Add model operations mutations
    const deleteModelMutation = useMutation({
        mutationFn: (modelId: number) => deleteModel(modelId),
        onSuccess: async (response, modelId) => {
            toast.success("Model deleted successfully");

            await queryClient.refetchQueries({ queryKey: ["models"] });
            await queryClient.refetchQueries({ queryKey: ["dashboard"] });

        },
        onError: (error: ErrorValue) => {
            console.error("Delete error:", error);
            toast.error(
                error?.response?.data?.message || "Failed to delete model"
            );
        },
    });

    const editModelMutation = useMutation({
        mutationFn: ({
            modelId,
            modelData,
        }: {
            modelId: number;
            modelData: EditModel;
        }) => editModel(modelId, modelData),
        onSuccess: async (response, { modelId }) => {
            console.log(response, modelId, "1");
            

            // Invalidate and refetch models
            await queryClient.refetchQueries({ queryKey: ["models"] });
            await queryClient.refetchQueries({ queryKey: ["dashboard"] });

            toast.success("Model updated successfully");
            setModelsState(modelsData?.data?.data || []);
            console.log("2 Refetch completed");
        },
        onError: (error: ErrorValue) => {
            console.error("Edit error:", error);
            toast.error("Failed to update model");
        },
    });
    const deleteLeadMutation = useMutation({
        mutationFn: (leadId: string) => deleteLeadById(leadId),
        onSuccess: async (response, leadId) => {
            // toast.success("Lead deleted successfully");
            await queryClient.refetchQueries({ queryKey: ["leads"] });
            await queryClient.refetchQueries({ queryKey: ["dashboard"] });
        },
        onError: (error: ErrorValue) => {
            console.error("Delete error:", error);
            toast.error(
                error?.response?.data?.message || "Failed to delete lead"
            );
        }
    });
    const editLeadMutation = useMutation({
        mutationFn: ({
            leadId,
            formData,
        }: {
            leadId: string;
            formData: FormData;
        }) => updateLeadDetails(leadId, formData),
        onSuccess: async (response, { leadId }) => {
            console.log(response, leadId, "1");
            // Invalidate and refetch leads
            await queryClient.refetchQueries({ queryKey: ["leads"] });
            await queryClient.refetchQueries({ queryKey: ["dashboard"] });
            toast.success("Lead updated successfully");
            console.log("2 Refetch completed");
        },
        onError: (error: ErrorValue) => {
            console.error("Edit error:", error);
            toast.error("Failed to update lead");
        },
    });
    const createLeadMutation = useMutation({
        mutationFn: (formData: FormData) => createLead(formData),
        onSuccess: async (response) => {
            toast.success("Lead created successfully");
            await queryClient.refetchQueries({ queryKey: ["leads"] });
            await queryClient.refetchQueries({ queryKey: ["dashboard"] });
        },
        onError: (error: ErrorValue) => {
            console.error("Create error:", error);
            toast.error("Failed to create lead");
        },
    });
    // Process existing data
    const models =
        modelsData?.data?.data?.filter(
            (model: Model) =>
                model.tripo_status !== "pending" && model.status === "APPROVED"
        ) || [];

    const modelsDataList = modelsData?.data?.data || [];
    const leads = leadsData || [];
    console.log(leadsData)
    const userProfile = profileData?.data?.result;
    console.log(dashLoading, modelsLoading, leadsLoading, profileLoading);
    const contextValue: DashboardContextType = {
        dashboardData: dashboardData?.data,
        modelsData,
        models,
        leads: leadsData?.data?.result,
        userProfile,
        modelsDataList: modelsData?.data?.data || [],
        isLoading:
            dashLoading || modelsLoading || leadsLoading || profileLoading,
        error: dashError || modelsError || leadsError || profileError,
        // Add model operations
        deleteModelMutation: deleteModelMutation.mutateAsync,
        editModelMutation: editModelMutation.mutateAsync,
        isDeleting: deleteModelMutation.isPending,
        isEditing: editModelMutation.isPending,
        deleteLeadMutation: deleteLeadMutation.mutateAsync,
        editLeadMutation: editLeadMutation.mutateAsync,
        createLeadMutation: createLeadMutation.mutateAsync,
    };

    return (
        <DashboardContext.Provider value={contextValue}>
            {children}
        </DashboardContext.Provider>
    );
};
