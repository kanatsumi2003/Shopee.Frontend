import axios, {HttpStatusCode} from "axios";
import {isTokenExpired} from "../utils/token.helper.ts";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    }
})

declare module 'axios' {
    export interface AxiosRequestConfig {
        requiresAuth?: boolean
    }
}

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('accessToken');
//         if(token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//
//         return config;
//     },
//     (error) => {
//         console.log(error)
//         Promise.reject(error);
//     }
// )

axiosInstance.interceptors.request.use(async (config) => {
    if (config.requiresAuth) {
        let accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const expireAt = localStorage.getItem('expireAt')

        if(!accessToken || !refreshToken || !expireAt) {
            return config;
        }

        if (isTokenExpired(accessToken)) {
            const result = await axiosInstance.post('/auths/access-token', {
                refreshToken: refreshToken,
            });
            const data = result.data.data;

            if(result.status === HttpStatusCode.Created) {
                accessToken = data.accessToken;
                config.headers['Authorization'] = `Bearer ${accessToken}`
                localStorage.setItem('accessToken', accessToken!);
            }
        } else if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
    }

    return config
})

export default axiosInstance;