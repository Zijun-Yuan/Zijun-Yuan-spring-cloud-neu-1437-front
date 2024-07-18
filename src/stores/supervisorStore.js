import { defineStore } from 'pinia';
import apiClient from '@/api/axios';
import * as supervisorAPI from '@/api/supervisor.js';

export const useSupervisorStore = defineStore('supervisor', {
    state: () => ({
        token: localStorage.getItem('supervisor-token') || '',
        supervisor: JSON.parse(localStorage.getItem('supervisor-data')) || {
            supervisorId: null,
            realName: '',
            telId: '',
            birthday: '',
            sex: null,
            age: null,
        },
        register: '',
        feedbackList: [],
    }),
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('supervisor-token', token);
            apiClient.interceptors.request.use(
                config => {
                    if (this.token) {
                        config.headers.Authorization = `Bearer ${this.token}`;
                    }
                    return config;
                },
                error => Promise.reject(error)
            );
        },
        setSupervisorData(data) {
            this.supervisor.supervisorId = data.supervisorId;
            this.supervisor.realName = data.realName;
            this.supervisor.telId = data.telId;
            this.supervisor.birthday = data.birthday;
            this.supervisor.sex = data.sex;
            this.supervisor.age = data.age;
            localStorage.setItem('supervisor-data', JSON.stringify(this.supervisor));
        },
        async supervisorLogin(data) {
            try {
                const response = await supervisorAPI.supervisorLogin(data);
                console.log(response);
                if (response.data.data !== null) {
                    this.setSupervisorData(response.data.data);
                    this.setToken(response.data.data.token);
                } else {
                    console.log('Login failed, response data:', response.data.data);
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        },
        async supervisorRegister(data) {
            try {
                const response = await supervisorAPI.supervisorRegister(data);
                if (response.data.code === 0) {
                    console.log('Register successful, response data:', response.data);
                    this.register = data.telId;
                } else {
                    console.log('Register failed, response data:', response.data);
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        },
        async supervisorFeedbackList() {
            try {
                const response = await supervisorAPI.getAllFeedbackList(this.supervisor.supervisorId);
                this.feedbackList = response.data.data;
            } catch (error) {
                console.error('Error during getting feedback list:', error);
            }
        },
        async addFeedback(data) {
            try {
                const response = await supervisorAPI.addInfo(data);
                if (response.data.code === 0) {
                    console.log('Feedback added successfully, response data:', response.data);
                    return true;
                } else {
                    console.log('Feedback adding failed, response data:', response.data);
                    return false;
                }
            } catch (error) {
                console.error('Error during adding feedback:', error);
            }
        },
        async updateSupervisor(data) {
            try {
                const beforeSupervisor = await supervisorAPI.getSupervisorByTelId(this.supervisor.telId);
                console.log(beforeSupervisor.data.data);
                beforeSupervisor.data.data.realName = data.realName;
                beforeSupervisor.data.data.birthday = data.birthday;
                beforeSupervisor.data.data.sex = (data.sex === "男" ? 1 : 0);
                beforeSupervisor.data.data.telId = data.telId;

                const response = await supervisorAPI.editPersonal(beforeSupervisor.data.data);
                if (response.data.code === 0) {
                    console.log('Supervisor updated successfully, response data:', response.data);
                    this.setSupervisorData(beforeSupervisor.data.data);
                    return true;
                } else {
                    console.log('Supervisor updating failed, response data:', response.data);
                    return false;
                }
            } catch (error) {
                console.error('Error during updating supervisor:', error);
            }
        },
        getToken() {
            return this.token;
        },
        async logout() {
            this.supervisor = {
                supervisorId: null,
                realName: '',
                telId: '',
                birthday: '',
                sex: null,
                age: null,
            };
            localStorage.removeItem('supervisor-token');
            localStorage.removeItem('supervisor-data');
            // try {
            //     await supervisorAPI.supervisorLogout();
            // } catch (error) {
            //     console.error('Error during logout:', error);
            // }
        },
    }
});
