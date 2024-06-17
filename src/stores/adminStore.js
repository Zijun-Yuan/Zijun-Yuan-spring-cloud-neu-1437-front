// src/stores/adminStore.js
import {
	defineStore
} from 'pinia';
import * as AdminAPI from '@/api/admin.js';
export const useAdminStore = defineStore('admin', {
	state: () => ({
		token: '',
		infoList: [],
	}),
	actions: {
		async fetchInfoList() {
			try {
				const response = await AdminAPI.getAllInfoList();
				console.log(response.data.data);
				this.infoList = response.data.data;
				console.log(this.infoList[0].infoId);
			} catch (error) {
				console.error('Failed to fetch data:', error);
			}
		},

		setToken(token) {
			this.token = token;
			console.log(this.token);
		},
		getToken() {
			return this.state.token;
		},
		logout() {
			this.token = '';
		},
	}
});