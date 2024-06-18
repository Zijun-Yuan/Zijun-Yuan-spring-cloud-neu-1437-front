import axios from './axios';

//获取事务数量信息数量
export function getInfoCount(){
	return axios.get('/admin/getInfoCount');
}

// 管理员登录
export function adminLogin(data) {
  return axios.post('/admin/login', data);
}

// 指派网格员
export function setInfoToInspector(data) {
  return axios.post('/admin/setInfoToInspector', data);
}

//获取当页事务列表
export function getInfoList(data) {
  return axios.get('/admin/getAllInfoList',data);
}

// 获取未指派事务列表
export function getAllNotAssignedInfoList() {
  return axios.get('/admin/getAllNotAssignedInfoList');
}

// 获取已指派事务列表
export function getAllAssignedInfoList() {
  return axios.get('/admin/getAllAssignedInfoList');
}

// 获取所有网格员列表
export function getInspectorList() {
  return axios.get('/admin/getInspectorList');
}

// 获取网格员事务列表
export function getInspectorInfoList(inspectorId) {
  return axios.get(`/admin/getInspectorInfoList?inspectorId=${inspectorId}`);
}

// 获取公众监督员事务列表
export function getSupervisorInfoList(supervisorId) {
  return axios.get(`/admin/getSupervisorInfoList?supervisorId=${supervisorId}`);
}

// 编辑公众监督员
export function editSuperVisor(data) {
  return axios.post('/admin/editSuperVisor', data);
}

// 查询所有公众监督员（未删除的）
export function getAllSupervisor() {
  return axios.get('/admin/getAllSupervisor');
}

// 查询一个公众监督员
export function getOneSupervisor(telId) {
  return axios.get(`/admin/getOneSupervisor?telId=${telId}`);
}

// 查询所有网格员
export function getAllInspectors() {
  return axios.get('/admin/getAllInspectors');
}

// 查询一个网格员
export function getOneInspector(inspectorCode) {
  return axios.get(`/admin/getOneInspector?inspectorCode=${inspectorCode}`);
}

// 编辑网格员
export function editInspector(data) {
  return axios.post('/admin/editInspector', data);
}

// 新增网格员
export function addInspector(data) {
  return axios.post('/admin/addInspector', data);
}

// Add other admin API requests here