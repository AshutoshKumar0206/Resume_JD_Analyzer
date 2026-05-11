import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ROUTES } from '../api/routes';

const axiosInstance: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // --- Request Interceptor ---
// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // Get token from storage
//     const userToken = Cookies.get("is_logged_in");
//     // const userToken = Cookies.get("user_token");
    
//     // If token exists, add it to the headers
//     if (userToken && config.headers) {
//       config.headers.Authorization = `Bearer ${userToken}`;
//     }
    
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific global errors
      switch (error.response.status) {
        case 401:
          // Unauthorized - maybe clear storage and redirect to login
          Cookies.remove('is_logged_in');
          Cookies.remove('user_token'); 
          window.location.href = ROUTES.LOGIN; 
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal Server Error');
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;