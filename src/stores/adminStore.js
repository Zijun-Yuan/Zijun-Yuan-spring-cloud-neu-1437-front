// src/stores/adminStore.js
import {
	defineStore
} from 'pinia';
import apiClient from '@/api/axios';
import * as AdminAPI from '@/api/admin.js';


export const useAdminStore = defineStore('admin', {
	state: () => ({
		token: '',
		infoList1: [],
		infoList2: [],
		infoList3: [],
		infoList4: [],
		supervisorList: [],
		inspectorList: [],
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

		async getSupervisorCount(params) {
			console.log(params);
			try {
				const response = await AdminAPI.getSupervisorNum({
					params: params
				});
				console.log("fetched num response: ", response.data.data);
				return response.data.data;
			} catch (error) {
				console.error("Failed to fetch SupervisorCount:", error);
			}
		},


		async getInspectorCount(params) {
			console.log(params);
			try {
				const response = await AdminAPI.getInspectorNum(params);
				console.log("fetched num response: ", response.data.data);
				return response.data.data;
			} catch (error) {
				console.error("Failed to fetch SupervisorCount:", error);
			}
		},

		async getInspectorList(params) {
			try {
				console.log("getInspectorList",params);
				const response = await AdminAPI.getInspectorList(params);
				this.inspectorList = response.data.data;
				if(response.data.code ===0){
					return true;
				}else{
					return false;
				}
			} catch (error) {
				console.error("Failed to getInspectorList:", error);
			}
		},
		
		async getSupervisorList(params) {
			try {
				console.log("getSupervisorList",params);
				const response = await AdminAPI.getSupervisorList({
					params: params
				});
				this.supervisorList = response.data.data;
				if(response.data.code ===0){
					return true;
				}else{
					return false;
				}
			} catch (error) {
				console.error("Failed to getSupervisorList:", error);
			}
		},
		
		

		async fetchInfoList(params) {
			console.log("fetchInfoList", params);
			try {
				const response = await AdminAPI.getInfoList(params);
				// console.log("fetched InfoList: ", response.data.data.list);
				// console.log(response.data.data.list.length);
				if (response.data.data.list.length === 0) {
					console.log("no data");
				}

				if (params.status === 1) {
					this.infoList1 = response.data.data.list;
					// console.log("InfoList1: ", this.infoList1);
				}
				else if (params.status === 2) {
					this.infoList2 = response.data.data.list;
					// console.log("InfoList2: ", this.infoList2);
				}
				else if (params.status === 3) {
					this.infoList3 = response.data.data.list;
					// console.log("InfoList3: ", this.infoList3);
					
				}
				console.log(response.data.code);
				if(response.data.code ===0){
					return true;
				}else{
					return false;
				}

			} catch (error) {

				console.error('Failed to fetch fetchInfoList:', error);
			}
		},



		async getInfoById(id) {
			try {
				const params = {
					id: id
				};
				// console.log(params);
				const response = await AdminAPI.getInfoById({
					params: params
				});
				// console.log("response ", response);

				console.log("fetched Info details: ", response.data.data);
				return response.data.data;
			} catch (error) {
				console.error("Failed to fetch getInfoById:", error);
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
				console.error("Failed to fetch getSupervisorByInfoId:", error);
			}
		},
		async getInspectorsByCityCodeList(cityCodeList) {
			try {
				const response = await AdminAPI.getInspectorsByCityCodeList(cityCodeList);
				const data = response.data.data;
				const inspectorList = data;
				console.log(inspectorList);
				return inspectorList;
			} catch (error) {
				console.error("Failed to fetch getInspectorsByCityCodeList:", error);
			}
		},

		async getCountByMonth(month) {
			try {
				const params = {
					month: month
				};
				const response = await AdminAPI.getCountByMonth({
					params: params
				});
				const data = response.data.data;
				return data;
			} catch (error) {
				console.error("Failed to getCountByMonth:", error);
			}
		},

		async getCountByAqiLevel(aqiLevel) {
			try {
				const params = {
					aqiLevel: aqiLevel
				};
				const response = await AdminAPI.getCountByAqiLevel({
					params: params
				});
				const data = response.data.data;
				return data;
			} catch (error) {
				console.error("Failed to getCountByAqiLevel:", error);
			}
		},

		async getProvinceGroupedInspectionStats() {
			try {
				const response = await AdminAPI.getProvincialStatisticData();
				this.infoList4 = response.data.data;
			} catch (error) {

				console.error('Failed to fetch fetchInfoList:', error);
			}
		},



		async getInspectorByInfoId(id) {
			try {
				const params = {
					infoId: id
				};

				const response = await AdminAPI.getInspectorByInfoId({
					params: params
				});
				// console.log("response ", response);
				// console.log("response.data: ", response.data);
				// console.log("fetched Inspector details: ", response.data.data);
				const data = response.data.data;
				const inspector = {
					realName: data.realName,
					telNum: data.telNum,
				};
				return inspector;
			} catch (error) {
				console.error("Failed to getInspectorByInfoId:", error);
			}
		},

		async getPerOfCapitals() {
			try {
				const response = await AdminAPI.getPerOfCapitals();
				const data = response.data.data;
				return data;
			} catch (error) {
				console.error("Failed to getPerOfCapitals:", error);
			}
		},

		async getPerOfMajorCities() {
			try {
				const response = await AdminAPI.getPerOfMajorCities();
				const data = response.data.data;
				return data;
			} catch (error) {
				console.error("Failed to getPerOfMajorCities:", error);
			}
		},

		async getInspectors() {
			try {
				// console.log("getInspectors");
				const response = await AdminAPI.getAllInspectors();
				// console.log("response ", response);
				// console.log("response.data: ", response.data);
				// console.log("fetched Inspector details: ", response.data.data);
				const data = response.data.data;
				// console.log(data);
				return data;
			} catch (error) {
				console.error("Failed to getInspectors:", error);
			}
		},

		async setInfoToInspector(infoId, inspectorId) {
			try {
				const params = {
					infoId: infoId,
					inspectorId: inspectorId,
				};

				const response = await AdminAPI.setInfoToInspector(params);
				const data = response.data.data;
				console.log(data.code);
			} catch (error) {
				console.error("Failed to setInfoToInspector:", error);
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