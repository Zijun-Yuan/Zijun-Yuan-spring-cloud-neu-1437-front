import {defineStore} from 'pinia';
import * as supervisorAPI from '@/api/supervisor.js';

export const useSupervisorStore = defineStore('supervisor', {
    state: () => ({
        token: '',
        supervisor: {
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
        async supervisorLogin(data) {
            try {
                const response = await supervisorAPI.supervisorLogin(data);
                if (response.data.data !== null) {
                    this.supervisor.telId = data.supervisorCode;
                    this.supervisor.supervisorId = response.data.data.supervisorId;
                    this.supervisor.realName = response.data.data.realName;
                    this.supervisor.birthday = response.data.data.birthday;
                    this.supervisor.sex = response.data.data.sex;
                    this.supervisor.age = response.data.data.age;
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

        async addFeedback(data){
          try {
              const response = await supervisorAPI.addInfo(data);
              if (response.data.code === 0) {
                  console.log('Feedback added successfully, response data:', response.data);
                  return true;
              } else {
                  console.log('Feedback adding failed, response data:', response.data);
                  return false;
              }
          }  catch (error) {
              console.error('Error during adding feedback:', error);
          }
        },

        async updateSupervisor(data){
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
                    this.supervisor.realName = data.realName;
                    this.supervisor.birthday = data.birthday;
                    this.supervisor.sex = (data.sex === "男" ? 1 : 0);
                    this.supervisor.telId = data.telId;
                    console.log(this.supervisor);
                    return true;
                } else {
                    console.log('Supervisor updating failed, response data:', response.data);
                    return false;
                }
            }  catch (error) {
                console.error('Error during updating supervisor:', error);
            }
        },

        setToken(token) {
            this.token = token;
            console.log(this.token);
        },
        getToken() {
            return this.token;
        },
        logout() {
            this.supervisor = {
                supervisorId: null,
                realName: '',
                telId: '',
                birthday: '',
                sex: null,
                age: null,
            };
        },
    }
});

