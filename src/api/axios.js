import axios from 'axios';
import router from '@/router';  // 确保从正确的位置导入router
import { ElMessage } from 'element-plus';

const apiClient = axios.create({
    baseURL: 'http://localhost:8101/api',
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
        if (error.response && error.response.status === 401) {
            // 这里无法直接使用useRouter，所以改为直接使用router
            if (router.currentRoute.value.meta.userType === 'supervisor') {
                router.push('/supervisor/login').catch(err => console.error(err));
            } else {
                router.push('/login').catch(err => console.error(err));
            }
            ElMessage.error('Session expired or not authorized. Please login again.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
