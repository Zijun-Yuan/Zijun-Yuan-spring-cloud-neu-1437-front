// src/stores/aqiLevelStore.js
import { defineStore } from 'pinia';

export const useAQIStore = defineStore('aqi', {
    state: () => ({
        aqiMap: {
            "1": { level: "一", name: "优级", color: "#00e400", number: 1, min: 0, max: 50 },
            "2": { level: "二", name: "良好", color: "#ffff00", number: 2, min: 50, max: 100 },
            "3": { level: "三", name: "轻度污染", color: "#ff7e00", number: 3, min: 100, max: 150 },
            "4": { level: "四", name: "中度污染", color: "#ff0000", number: 4, min: 150, max: 200 },
            "5": { level: "五", name: "重度污染", color: "#99004c", number: 5, min: 200, max: 300 },
            "6": { level: "六", name: "严重污染", color: "#7e0023", number: 6, min: 300, max: 999 },
            "7": { level: "未知", name: "未知", color: "#000000", number: 7, min: 1000, max: 10000 },
        },
        currentAQIDetail: {}
    }),
    actions: {
        getAQIDetail(level) {
            if (this.aqiMap[level]) {
                this.currentAQIDetail = this.aqiMap[level];
                return this.currentAQIDetail;
            } else {
                console.error("No AQI detail found for level:", level);
                return null;
            }
        },
        getAllAQILevels() {
            return Object.keys(this.aqiMap).map(key => ({
                level: key,
                ...this.aqiMap[key]
            }));
        },
        getAQILevelByCheck(check) {
            for (const key in this.aqiMap) {
                const aqi = this.aqiMap[key];
                if (check > aqi.min && check <= aqi.max) {
                    return key;
                }
            }
            return null;
        }
    }
});

