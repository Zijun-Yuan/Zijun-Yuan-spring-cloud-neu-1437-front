// src/stores/aqiLevelStore.js
import { defineStore } from 'pinia';

export const useAQIStore = defineStore('aqi', {
    state: () => ({
        aqiMap: {
            "1": { level: "一", name: "优级" },
            "2": { level: "二", name: "良好" },
            "3": { level: "三", name: "轻度污染" },
            "4": { level: "四", name: "中度污染" },
            "5": { level: "五", name: "重度污染" },
            "6": { level: "六", name: "严重污染" }
        },
        currentAQLDetail: {}
    }),
    actions: {
        getAQLDetail(level) {
            if (this.aqiMap[level]) {
                this.currentAQLDetail = this.aqiMap[level];
                return this.currentAQLDetail;
            } else {
                // Handle the case where no matching level is found
                console.error("No AQI detail found for level:", level);
                return null;
            }
        }
    }
});

