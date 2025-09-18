import axios from 'axios';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // This is crucial for sending the httpOnly cookies back and forth
    withCredentials: true,
});

export default apiClient;