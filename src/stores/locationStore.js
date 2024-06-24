import {
	defineStore
} from 'pinia';
import * as LocationAPI from '@/api/location.js';
export const useLocationStore = defineStore('location', {
	state: () => ({
		provinces: [],
		cities: [],
		provinceMap: {},
		cityMap: {},
		initFlag: false,
	}),
	actions: {
		async initLocationStore() {
			await this.fetchLocation();
			this.provinceMap = await this.createProvinceMap(this.provinces);
			this.cityMap = await this.createCityMap(this.cities, this.provinceMap);
			this.initFlag = true;
		},

		async fetchLocation() {
			try {
				const responseProvince = await LocationAPI.getProvinceList();
				const responseCity = await LocationAPI.getCityList();
				this.provinces = responseProvince.data.data;
				this.cities = responseCity.data.data;
				// console.log("responseProvince: ", this.provinces);
				// console.log("responseCity: ", this.cities);
			} catch (error) {
				console.error('Failed to fetch data:', error);
			}
		},

		async createProvinceMap(provinces) {
			const provinceMap = {};
			this.provinces.forEach(province => {
				provinceMap[province.provinceId] = province;
			});
			return provinceMap;
		},

		async createCityMap(cities, provinceMap) {
			const cityMap = {};
			this.cities.forEach(city => {
				const provinceInfo = provinceMap[city.provinceId];
				cityMap[city.cityCode] = {
					...city,
					province: provinceInfo
				};
			});
			return cityMap;
		},

		async getProvinceByCityCode(cityCode) {
			if (!this.initFlag) {
				await this.initLocationStore();
			}
			return this.cityMap[cityCode]?.province;
		},

		async getCitiesByProvinceId(provinceId) {
			if (!this.initFlag) {
				await this.initLocationStore();
			}
			return this.cities.filter(city => city.provinceId === provinceId);
		},

		// 这里只返回city对象，不返回province对象
		async getCityAndProvinceByCityCode(cityCode) {
			if (!this.initFlag) {
				await this.initLocationStore();
			}
			return this.cityMap[cityCode];
		},

		async getProvinceByProvinceId(provinceId) {
			if (!this.initFlag) {
				await this.initLocationStore();
			}
			return this.provinceMap[provinceId];
		},

		async getAllProvinces() {
			if (!this.initFlag) {
				await this.initLocationStore();
			}
			return this.provinces;
		},

		async getCitieCodeListByProvinceId(provinceId) {
			if (!this.initFlag) {
				await this.initLocationStore();
			}
			return this.cities
				.filter(city => city.provinceId === provinceId)
				.map(city => city.cityCode); 
		},

		async test() {
			await this.initLocationStore();
			console.log(this.getCityAndProvinceByCityCode('101010200'));
			console.log(this.getProvinceByProvinceId(1));
		},
	}
});