import axios from 'axios';
import router from '@/router';  // 确保从正确的位置导入router
import { ElMessage } from 'element-plus';

const apiClient = axios.create({
    baseURL: 'http://localhost:9998/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // 允许携带cookie
});

apiClient.interceptors.request.use(
    config => {
        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

export default apiClient;
