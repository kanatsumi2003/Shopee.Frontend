import React from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const isAuthenticated = (): boolean => {
    const accessToken = localStorage.getItem("accessToken");
    const expireAt = localStorage.getItem("expireAt");
    if (!accessToken) {
        return false;
    }

    return Number(expireAt) > (Math.floor(Date.now() / 1000));
}

const ProtectedRoute: React.FC = () => {
    const location = useLocation();

    return isAuthenticated() ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default ProtectedRoute;
