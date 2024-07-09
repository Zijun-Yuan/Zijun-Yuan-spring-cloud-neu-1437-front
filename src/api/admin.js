import axios from './axios';
//获取所有事务
export function getInfoList(data) {
    return axios.post(`/admin/task/getMultiQueryInfoList`, data);
}

//获取所有事务数量信息数量
export function getInfoCount(data) {
    return axios.post(`/admin/task/getMultiQueryInfoCount`, data);
}

// 通过电话号码模糊查询公众监督员数量
export function getSupervisorNum(data) {
    return axios.get(`/admin/personnel/getSupervisorNum`, data);
}

//获取查询后的公众监督员分页列表
export function getSupervisorList(data) {
    return axios.get(`/admin/personnel/getSupervisorList`, data);
}

// 通过电话号码模糊查询网格员数量
export function getInspectorNum(data) {
    return axios.post(`/admin/personnel/getInspectorNum`, data);
}

//获取查询后的网格员分页列表
export function getInspectorList(data) {
    return axios.post(`/admin/personnel/getInspectorList`, data);
}

//通过CityList获取inspectors
export function getInspectorsByCityCodeList(data){
    return axios.post(`/admin/personnel/getListByCityCodeList`, data);
}
//获取指定信息
export function getInfoById(data) {
    return axios.get('/admin/task/getInfoById', data);
}

//根据infoid获取公众监督员信息
export function getSupervisorByInfoId(data) {
    return axios.get('/admin/task/getSupervisorByInfoId', data);
}

//根据infoid获取网格员信息
export function getInspectorByInfoId(data) {
    return axios.get('/admin/task/getInspectorByInfoId', data);
}

// 管理员登录
export function adminLogin(data) {
    return axios.post(`/admin/task/login`, data);
}

// 指派网格员
export function setInfoToInspector(data) {
    return axios.post(`/admin/task/setInfoToInspector`, data);
}

// 编辑公众监督员
export function editSuperVisor(data) {
    return axios.post(`/admin/personnel/editSuperVisor`, data);
}

// 查询所有公众监督员（未删除的）
export function getAllSupervisor() {
    return axios.get(`/admin/personnel/getAllSupervisor`);
}

// 查询一个公众监督员
export function getOneSupervisor(telId) {
    return axios.get(`/admin/personnel/getOneSupervisor?telId=${telId}`);
}

// 查询所有网格员
export function getAllInspectors() {
    return axios.get(`/admin/personnel/getAllInspectors`);
}

// 查询一个网格员
export function getOneInspector(inspectorCode) {
    return axios.get(`/admin/personnel/getOneInspector?inspectorCode=${inspectorCode}`);
}

// 编辑网格员
export function editInspector(data) {
    return axios.post(`/admin/personnel/editInspector`, data);
}

// 新增网格员
export function addInspector(data) {
    return axios.post(`/admin/personnel/addInspector`, data);
}

// 获取AQI等级统计数据
export function getCountByAqiLevel(data) {
    return axios.get('/admin/data/countByAqiLevel', data);
}

// 获取省会城市覆盖率
export function getPerOfCapitals() {
    return axios.get('/admin/data/getPerOfCapitals');
}

// 获取月份AQI超标数量
export function getCountByMonth(data) {
    return axios.get('/admin/data/getCountByMonth', data);
}

// 获取省份分组统计数据
export function getProvincialStatisticData() {
    return axios.get('/admin/data/getProvincialStatisticData');
}

// 获取大城市覆盖率
export function getPerOfMajorCities() {
    return axios.get('/admin/data/getPerOfMajorCities');
}