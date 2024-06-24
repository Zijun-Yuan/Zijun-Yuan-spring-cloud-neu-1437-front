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
				const response = await AdminAPI.getInfoCount(params);
				console.log("fetched num response: ", response.data.data);
				// console.log("fetched status",+status+" num: ", response.data.data);
				return response.data.data;
			} catch (error) {
				console.error("Failed to fetch infoCount:", error);
			}
		},


		async fetchInfoList(params) {
			console.log("fetchInfoList",params);
			try {
				const response = await AdminAPI.getInfoList(params);
				console.log("fetched InfoList: ", response.data.data.list);
				if (params.status === 1) {
					this.infoList1 = response.data.data.list;
					// console.log("InfoList1: ", this.infoList1);
					return;
				}
				if (params.status === 2) {
					this.infoList2 = response.data.data.list;
					// console.log("InfoList2: ", this.infoList2);
					return;
				}
				if (params.status === 3) {
					this.infoList3 = response.data.data.list;
					// console.log("InfoList3: ", this.infoList3);
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
		getInfoList1() {
			return this.infoList1;
		},
		getInfoList2() {
			return this.infoList2;
		},
		getInfoList3() {
			return this.infoList3;
		},
		
	}
});