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
                console.log("fetching location data...");
                const responseProvince = await LocationAPI.getProvinceList();
                const responseCity = await LocationAPI.getCityList();
                this.provinces = responseProvince.data.data;
                this.cities = responseCity.data.data;
                console.log("responseProvince: ", this.provinces);
                console.log("responseCity: ", this.cities);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }

        },

        async createProvinceMap(provinces) {
            console.log("creating province map...");
            const provinceMap = {};
            this.provinces.forEach(province => {
                provinceMap[province.provinceId] = province;
            });
            return provinceMap;
        },

        async createCityMap(cities, provinceMap) {
            console.log("creating city map...");
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

        getProvinceByCityCode(cityCode) {
            if (!this.initFlag) {
                this.initLocationStore();
            }
            console.log("返回城市所属省份")
            return this.cityMap[cityCode]?.province;
        },

        getCitiesByProvinceId(provinceId) {
            if (!this.initFlag) {
                this.initLocationStore();
            }
            return this.cities.filter(city => city.provinceId === provinceId);
        },

        getCityAndProvinceByCityCode(cityCode) {
            if (!this.initFlag) {
                console.log("initFlag is false");
                this.initLocationStore();
            }
            console.log("返回城市所属城市")
            return this.cityMap[cityCode];
        },

        getProvinceByProvinceId(provinceId) {
            if (!this.initFlag) {
                this.initLocationStore();
            }
            return this.provinceMap[provinceId];
        },

        async test() {
            await this.initLocationStore();
            console.log(this.getCityAndProvinceByCityCode('101010200'));
            console.log(this.getProvinceByProvinceId(1));
        },
    }
});