import axios from './axios';

export function adminLogin(data) {
  return axios.post('/admin/login', data);
}

// Add other admin API requests here
