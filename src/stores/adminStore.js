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
		async getInfoCount() {
			try {
				const response = await AdminAPI.getInfoCount();
				// console.log("response ", response);
				// console.log("response.data: ", response.data);
				console.log("fetched Info num: ", response.data.data);
				return response.data.data;
			} catch (error) {
				console.error("Failed to fetch infoCount:", error);
			}
		},

		async fetchInfoList(pageNum,pageSize) {
			try {
				const params = {
					pageNum: pageNum,
					pageSize: pageSize,
				};
				const response = await AdminAPI.getInfoList({params: params});
				console.log("Info List: ", response.data.data.list);
				this.infoList = response.data.data.list; 
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