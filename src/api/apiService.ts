import axios, { InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    const token = localStorage.getItem('token');
    // Skip adding token for login and register routes
    if (token && !['/login', '/signup'].includes(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 && !isRedirecting) {
//       isRedirecting = true; // prevent infinite loop
//       localStorage.removeItem("token");

//       // Delay navigation slightly to let interceptor finish
//       setTimeout(() => {
//         window.location.href = "/";
//       }, 0);
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;