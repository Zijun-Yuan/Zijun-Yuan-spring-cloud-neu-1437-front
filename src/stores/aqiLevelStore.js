// src/stores/aqiLevelStore.js
import { defineStore } from 'pinia';

export const useAQIStore = defineStore('aqi', {
    state: () => ({
        aqiMap: {
            "1": { level: "一", name: "优级", color: "#00e400" },
            "2": { level: "二", name: "良好", color: "#ffff00" },
            "3": { level: "三", name: "轻度污染", color: "#ff7e00" },
            "4": { level: "四", name: "中度污染", color: "#ff0000" },
            "5": { level: "五", name: "重度污染", color: "#99004c" },
            "6": { level: "六", name: "严重污染", color: "#7e0023" },
            "7": { level: "未知", name: "未知", color: "#000000" },
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
        }
    }
});

