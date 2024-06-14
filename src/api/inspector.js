import axios from './axios';

// 网格员登录
export function login(data){
    return axios.post('/inspector/login', data)
}

// 网格员获取详细事务信息
export function getDetailedInfo(infoId){
    return axios.get('/inspector/detailedInfo/?infoId=${infoId}')
}

// 网格员反馈实时数据信息
export function feedbackInfo(data){
    return axios.post('/inspector/feedbackInfo', data)
}

// 网格员获取对应事务列表
export function getInfoList(inspectorId){
    return axios.get('/inspector/infoList/?inspectorId=${inspectorId}')
}