import axios from './axios';
//获取所有事务
export function getInfoList(data) {
    return axios.post(`/admin/getMultiQueryInfoList`, data);
}

//获取所有事务数量信息数量
export function getInfoCount(data) {
    return axios.post(`/admin/getMultiQueryInfoCount`, data);
}

export function getInspectorsByCityCodeList(data){
    return axios.post(`/admin/getListByCityCodeList`, data);
}
//获取指定信息
export function getInfoById(data) {
    return axios.get('/admin/getInfoById', data);
}

//根据infoid获取公众监督员信息
export function getSupervisorByInfoId(data) {
    return axios.get('/admin/getSupervisorByInfoId', data);
}

//根据infoid获取网格员信息
export function getInspectorByInfoId(data) {
    return axios.get('/admin/getInspectorByInfoId', data);
}

// 管理员登录
export function adminLogin(data) {
    return axios.post(`/admin/login`, data);
}

// 指派网格员
export function setInfoToInspector(data) {
    return axios.post(`/admin/setInfoToInspector`, data);
}

// 获取所有网格员列表
export function getInspectorList() {
    return axios.get('/admin/getInspectorList');
}

// 编辑公众监督员
export function editSuperVisor(data) {
    return axios.post(`/admin/editSuperVisor`, data);
}

// 查询所有公众监督员（未删除的）
export function getAllSupervisor() {
    return axios.get(`/admin/getAllSupervisor`);
}

// 查询一个公众监督员
export function getOneSupervisor(telId) {
    return axios.get(`/admin/getOneSupervisor?telId=${telId}`);
}

// 查询所有网格员
export function getAllInspectors() {
    return axios.get(`/admin/getAllInspectors`);
}

// 查询一个网格员
export function getOneInspector(inspectorCode) {
    return axios.get(`/admin/getOneInspector?inspectorCode=${inspectorCode}`);
}

// 编辑网格员
export function editInspector(data) {
    return axios.post(`/admin/editInspector`, data);
}

// 新增网格员
export function addInspector(data) {
    return axios.post(`/admin/addInspector`, data);
}

// Add other admin API requests here

// 获取AQI等级统计数据
export function getCountByAqiLevel(data) {
    return axios.get('/admin/countByAqiLevel', data);
}

// 获取省会城市覆盖率
export function getPerOfCapitals() {
    return axios.get('/admin/getPerOfCapitals');
}

// 获取月份AQI超标数量
export function getCountByMonth(data) {
    return axios.get('/admin/getCountByMonth', data);
}

// 获取省份分组统计数据
export function getProvincialStatisticData() {
    return axios.get('/admin/getProvincialStatisticData');
}

