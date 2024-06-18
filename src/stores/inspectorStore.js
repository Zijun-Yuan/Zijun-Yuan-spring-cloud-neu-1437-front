import {defineStore} from 'pinia';
import * as inspectorAPI from '@/api/inspector.js';

export const useInspectorStore = defineStore('inspector', {
    state: () => ({
        token: '',
        inspectorCode: '',
    }),
    actions: {
        async inspectorLogin(data) {
            try {
                const response = await inspectorAPI.login(data);
                if (response.data.code === 0) {
                    console.log('Login successful, response data:', response.data);
                    this.inspectorCode = data.inspectorCode;
                } else {
                    console.log('Login failed, response data:', response.data);
                }
            } catch (error) {
                console.error('Error during login:', error);
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