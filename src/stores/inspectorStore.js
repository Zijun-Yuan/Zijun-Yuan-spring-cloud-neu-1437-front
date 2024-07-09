import {
    defineStore
} from 'pinia';
import * as inspectorAPI from '@/api/inspector.js';
import apiClient from "@/api/axios";

export const useInspectorStore = defineStore('inspector', {
    state: () => ({
        token: '',
        inspectorId: '',
        inspectorCode: '',
        telNum: '',
        realName: '',
        cityCode: ''
    }),
    actions: {
		setToken(token) {
			this.token = token;
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
        },
    }
});