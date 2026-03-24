import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const location = useLocation();

    if (!token) {
        // Not logged in, redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole && !allowedRoles.includes(userRole)) {
        // Role not authorized, redirect to home or a specific unauthorized page
        // For now, let's redirect to the correct dashboard if they are logged in as something else
        if (userRole === "admin") return <Navigate to="/admin-dashboard" replace />;
        if (userRole === "trainer") return <Navigate to="/trainer-dashboard" replace />;
        if (userRole === "member") return <Navigate to="/member-dashboard" replace />;
        
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
