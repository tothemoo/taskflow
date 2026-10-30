
import axios from "axios";

// Create one Axios instance for our backend API.
const api = axios.create({
    baseURL: "http://localhost:8000/api"
});

// Run this function before every request.
api.interceptors.request.use(
    (config) => {
        // Retrieve the JWT saved during login.
        const token = localStorage.getItem("token");

        // Attach the token if one exists.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Return the updated request configuration.
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
