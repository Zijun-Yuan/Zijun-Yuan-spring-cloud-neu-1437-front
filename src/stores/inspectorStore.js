import {
    defineStore
} from 'pinia';
import * as inspectorAPI from '@/api/inspector.js';
import apiClient from "@/api/axios";

export const useInspectorStore = defineStore('inspector', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        inspectorId: localStorage.getItem('inspectorId') || '',
        inspectorCode: localStorage.getItem('inspectorCode') || '',
        telNum: localStorage.getItem('telNum') || '',
        realName: localStorage.getItem('realName') || '',
        cityCode: localStorage.getItem('cityCode') || ''
    }),
    actions: {
		setToken(token) {
			this.token = token;
            localStorage.setItem('inspector-token', token);
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
        async inspectorLogin(data) {
            try {
                const response = await inspectorAPI.login(data);
                if (response.data.code === 0) {
                    console.log('Login successful, response data:', response.data);
                    this.inspectorCode = data.inspectorCode;
                    this.inspectorId = response.data.data.inspectorId;
                    this.telNum = response.data.data.telNum;
                    this.realName = response.data.data.realName;
                    this.cityCode = response.data.data.cityCode;
                    this.setToken(response.data.data.token);

                    localStorage.setItem('inspectorId', this.inspectorId);
                    localStorage.setItem('inspectorCode', this.inspectorCode);
                    localStorage.setItem('telNum', this.telNum);
                    localStorage.setItem('realName', this.realName);
                    localStorage.setItem('cityCode', this.cityCode);
                } else {
                    console.log('Login failed, response data:', response.data);
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        },
        getToken() {
            return this.token;
        },
        logout() {
            this.token = '';
            localStorage.removeItem('token');
            localStorage.removeItem('inspectorId');
            localStorage.removeItem('inspectorCode');
            localStorage.removeItem('telNum');
            localStorage.removeItem('realName');
            localStorage.removeItem('cityCode');
        },
    }
});