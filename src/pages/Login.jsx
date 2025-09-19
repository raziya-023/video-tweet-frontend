import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { login as authLogin } from '../store/authSlice';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await apiClient.post('/users/login', formData);
            if (response.data && response.data.success) {
                // The backend sends user data inside a 'data' object
                const { user } = response.data.data;
                dispatch(authLogin(user));
                navigate('/'); // Redirect to home page
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white">Login to Your Account</h2>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email or Username
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="username"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;