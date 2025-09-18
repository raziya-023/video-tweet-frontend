import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-9xl font-bold text-indigo-500">404</h1>
            <h2 className="text-4xl font-semibold text-white mt-4">Page Not Found</h2>
            <p className="text-gray-400 mt-2">
                Sorry, the page you are looking for does not exist.
            </p>
            <div className="mt-6">
                <Link
                    to="/"
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;