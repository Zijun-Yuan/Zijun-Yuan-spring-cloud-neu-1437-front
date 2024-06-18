import {defineStore} from 'pinia';
import * as supervisorAPI from '@/api/supervisor.js';
import {ElMessage} from "element-plus";

export const useSupervisorStore = defineStore('supervisor', {
    state: () => ({
        token: '',
        supervisorCode: '',
        register: '',
    }),
    actions: {
        async supervisorLogin(data) {
            try {
                const response = await supervisorAPI.supervisorLogin(data);
                if (response.data.code === 0) {
                    console.log('Login successful, response data:', response.data);
                    this.supervisorCode = data.supervisorCode;
                } else {
                    console.log('Login failed, response data:', response.data);
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

        setToken(token) {
            this.token = token;
            console.log(this.token);
        },
        getToken() {
            return this.token;
        },
        logout() {
            this.token = '';
        },
    }
});

