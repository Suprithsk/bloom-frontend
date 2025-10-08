import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DashboardContext } from '@/context/DasboardContext';
import { toast } from 'sonner';
import { isSessionValid, clearSession } from '../utils/sessionManager';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return (props: P) => {
        const navigate = useNavigate();
        const { error } = useContext(DashboardContext) || {};

        useEffect(() => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                navigate("/");
                return;
            }

            // Check if session is still valid
            if (!isSessionValid()) {
                clearSession();
                toast.error("Session expired due to inactivity. Please login again.");
                navigate("/");
                return;
            }
            
        }, [error, navigate]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;