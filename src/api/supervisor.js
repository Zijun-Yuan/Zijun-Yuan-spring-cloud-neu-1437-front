import axios from './axios';

// 公众监督员登录
export function supervisorLogin(data) {
    return axios.post('/supervisor/login', data);
}

// 公众监督员注册
export function supervisorRegister(data) {
    return axios.post('/supervisor/register', data);
}

// 根据手机号查询公众监督员个人信息
export function getSupervisorByTelId(telId) {
    return axios.get(`/supervisor/getSupervisorByTelId?telId=${telId}`);
}

// 编辑公众监督员个人信息
export function editPersonal(data) {
    return axios.post('/supervisor/editPersonal', data);
}

// 查询公众监督员历史反馈信息列表
export function getAllFeedbackList(supervisorId) {
    return axios.get('/supervisor/getAllFeedbackList', {
        params: {
            supervisorId: supervisorId
        }
    });
}

// 公众监督员反馈监督信息
export function addInfo(data) {
    return axios.post('/supervisor/addInfo', data);
}