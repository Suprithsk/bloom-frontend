import CreateModelBanner from "@/components/create-model-banner"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import MyModelsPage from "@/components/my-models"
import { DashboardContext } from "@/context/DasboardContext"
import Models from "@/pages/Models"
import { useContext } from "react"

const ModelsComponent = () => {
    const { modelsDataList } = useContext(DashboardContext) || {};

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />
            <main className="pt-16 mb-10">
                <CreateModelBanner />
                <MyModelsPage models={modelsDataList} />
            </main>
            
            
        </div>
    )
}

export default ModelsComponent