// src/stores/adminStore.js
import {
	defineStore
} from 'pinia';
import * as AdminAPI from '@/api/admin.js';
export const useAdminStore = defineStore('admin', {
	state: () => ({
		token: '',
		infoList1: [],
		infoList2: [],
		infoList3: [],
	}),
	actions: {
		async getInfoCount(params) {
			// console.log("start getInfoCountByStatus");
			console.log(params);
			try {
				const response = await AdminAPI.getInfoCount({
					params: params
				});
				// console.log("fetched num response: ", response.data.data);
				// console.log("fetched status",+status+" num: ", response.data.data);
				return response.data.data;
			} catch (error) {
				console.error("Failed to fetch infoCount:", error);
			}
		},


		async fetchInfoList(params) {
			try {
				console.log("fetchInfoList",params);
				const response = await AdminAPI.getInfoList({
					params: params
				});
				console.log("fetched InfoList: ", response.data.data);
				if (status === 1) {
					this.infoList1 = response.data.data.list;
					return;
				}
				if (status === 2) {
					this.infoList2 = response.data.data.list;
					return;
				}
				if (status === 3) {
					this.infoList3 = response.data.data.list;
					return;
				}
				
			} catch (error) {
				console.error('Failed to fetch data:', error);
			}
		},


		async getInfoById(id) {
			try {
				const params = {
					id: id
				};
				const response = await AdminAPI.getInfoById({
					params: params
				});
				// console.log("response ", response);

				console.log("fetched Info details: ", response.data.data);
				return response.data.data;
			} catch (error) {
				console.error("Failed to fetch infoCount:", error);
			}
		},

		async getSupervisorByInfoId(id) {
			try {
				const params = {
					infoId: id
				};

				const response = await AdminAPI.getSupervisorByInfoId({
					params: params
				});
				// console.log("response ", response);
				// console.log("response.data: ", response.data);
				// console.log("fetched Supervisor details: ", response.data.data);
				const data = response.data.data;
				const supervisor = {
					realName: data.realName,
					telId: data.telId,
					birthday: data.birthday,
					sex: data.sex,
				};
				return supervisor;
			} catch (error) {
				console.error("Failed to fetch infoCount:", error);
			}
		},
		logout() {
			this.token = '';
		},
	}
});