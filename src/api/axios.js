import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  config => {
    // Add token or other request configurations here
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default instance;
