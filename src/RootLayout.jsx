import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { login, logout } from './store/authSlice';
import apiClient from './api/axios';

function RootLayout() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("RootLayout: Auth check initiated.");
        
        // Let's create a controller to be able to cancel the request
        const controller = new AbortController();

        apiClient.get('/users/currentUser', { signal: controller.signal })
            .then((response) => {
                console.log("RootLayout: API call successful.", response.data);
                if (response.data && response.data.success) {
                    dispatch(login(response.data.data));
                } else {
                    dispatch(logout());
                }
            })
            .catch((error) => {
                if (error.name === 'CanceledError') {
                    console.log("RootLayout: Request canceled.");
                } else {
                    console.error("RootLayout: Auth check failed.", error);
                    dispatch(logout());
                }
            })
            .finally(() => {
                console.log("RootLayout: Auth check finished.");
                setLoading(false);
            });
        
        // Cleanup function to cancel the request if the component unmounts
        return () => {
            controller.abort();
        };

    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <p className="text-white text-xl">Loading application...</p>
            </div>
        );
    }

    return <Outlet />;
}

export default RootLayout;