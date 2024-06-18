import axios from './axios';

// 获得所有城市列表
export function getCityList() {
  return axios.get('/location/city/getAllCities');
}

// 获得所有省份列表
export function getProvinceList() {
  return axios.get('/location/province/getAllProvinces');
}

// 根据省份id获得省份
export function getProvinceById(provinceId) {
  return axios.post('/location/province/getProvinceById' + provinceId);
}

// 根据省份Id获得对应城市
export function getCitiesByProvinceId(provinceId) {
  return axios.post('/location/city/getAllCitiesByProvinceId' + provinceId);
}

// 根据城市Id获得城市信息
export function getCityById(cityId) {
  return axios.post('/location/city/getCityById' + cityId);
}