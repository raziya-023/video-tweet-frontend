import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout({ authentication = true }) {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // This component can protect routes that require you to be logged IN or logged OUT
    // For the dashboard, we need authentication = true
    if (authentication && !isAuthenticated) {
        // If the user is not authenticated, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // If the user IS authenticated, render the child component (e.g., the Dashboard)
    return <Outlet />;
}

export default AuthLayout;