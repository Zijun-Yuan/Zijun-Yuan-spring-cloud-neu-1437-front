import axios from './axios';

export function getCityList(data) {
  return axios.post('/admin/login', data);
}
x