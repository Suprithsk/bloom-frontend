// ProtectedRoute.tsx
import { DashboardProvider } from "@/context/DasboardContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
       
    if (!token) {
        // not logged in → redirect
        return <Navigate to="/" replace />;
    }

    return <>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </>; // logged in → show page
};

export default ProtectedRoute;
