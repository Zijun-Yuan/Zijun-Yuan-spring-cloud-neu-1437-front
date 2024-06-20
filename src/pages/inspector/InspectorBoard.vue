<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        反馈任务列表
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="showUncompleted">待检测</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="showCompleted">已完成</el-button>
          </el-col>
        </el-row>
        <!-- 这里为待检测任务的表格 -->
        <div v-if="showContent === 'uncompleted'">
          <el-table :data="uncompletedInfoList">
            <el-table-column type="index" label="序号" :index="indexMethod" /> <!-- 显示序号 -->
            <el-table-column label="省份">
              <template #default="{ row }">
                <span>{{ row.province.provinceName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="城市">
              <template #default="{ row }">
                <span>{{ row.city.cityName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="AQI">
              <template #default="{ row }">
                <div v-if="row.aqiLevel !== undefined && row.aqiLevel !== null"
                     class="aqi-box"
                     :style="{ background: getAQIDetail(row.aqiLevel)?.color }">
                  <span>{{ getAQIDetail(row.aqiLevel)?.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="timeSupervisor" label="时间" />
          </el-table>
        </div>
        <!-- 这里为已完成任务的表格 -->
        <div v-else-if="showContent === 'completed'">
          <el-table :data="completedInfoList">
            <el-table-column type="index" label="序号" :index="indexMethod" /> <!-- 显示序号 -->
            <el-table-column label="省份">
              <template #default="{ row }">
                <span>{{ row.province.provinceName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="城市">
              <template #default="{ row }">
                <span>{{ row.city.cityName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="AQI">
              <template #default="{ row }">
                <div v-if="row.aqiLevel !== undefined && row.aqiLevel !== null"
                     class="aqi-box"
                     :style="{ background: getAQIDetail(row.aqiLevel)?.color }">
                  <span>{{ getAQIDetail(row.aqiLevel)?.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="timeSupervisor" label="时间" />
          </el-table>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useInspectorStore } from '@/stores/inspectorStore';
import { getInfoList } from '@/api/inspector';
import { useLocationStore } from "@/stores/locationStore";
import { useAQIStore } from '@/stores/aqiLevelStore';

export default {
  name: 'InspectorBoard',
  setup: function () {
    const showContent = ref('uncompleted');
    const inspectorStore = useInspectorStore();
    const locationStore = useLocationStore();
    const aqiStore = useAQIStore();

    const infoList = ref([]);
    const uncompletedInfoList = ref([]);
    const completedInfoList = ref([]);

    const fetchInfoList = async () => {
      try {
        const inspectorCode = inspectorStore.inspectorCode;
        const response = await getInfoList(inspectorCode); // 在获取信息列表后处理数据
        if (response.data.code === 0) {
          infoList.value = response.data.data;
          await processInfoList();
        } else {
          console.error('Failed to fetch info list:', response.data.message);
        }
      } catch (error) {
        console.error('Error during fetching info list:', error);
      }
    };

    // 展示待检测的任务列表
    const showUncompleted = async () => {
      showContent.value = 'uncompleted';
      await fetchInfoList();
    };

    // 展示已完成的任务列表
    const showCompleted = async () => {
      showContent.value = 'completed';
      await fetchInfoList();
    };

    // 获取省份信息
    const getProvince = async (cityCode) => {
      try {
        return await locationStore.getProvinceByCityCode(cityCode);
      } catch (error) {
        console.error('Failed to get province:', error);
        return { provinceName: '' };
      }
    }

    // 获取城市信息
    const getCity = async (cityCode) => {
      try {
        return await locationStore.getCityAndProvinceByCityCode(cityCode);
      } catch (error) {
        console.error('Failed to get city:', error);
        return { cityName: '' };
      }
    }

    // 处理任务列表（待检测和已完成 以及 省份城市信息的获取）
    const processInfoList = async () => {
      const items = infoList.value;
      const uncompletedItems = [];
      const completedItems = [];

      for (const item of items) {
        const province = await getProvince(item.cityCode);
        const city = await getCity(item.cityCode);
        if (province && city) {
          const processedItem = {
            ...item,
            province: province,
            city: city,
            aqiLevel: item.aqiLevel || 7
          };
          // 处理状态
          // 0: 已删除 1: 公众监督员supervisor已提交 2: 已指派网格员inspector 3: 网格员inspector已填写
          if (item.status === 3) {
            completedItems.push(processedItem);
          } else if (item.status === 2) {
            uncompletedItems.push(processedItem);
          }
        }
      }
      completedInfoList.value = completedItems;
      uncompletedInfoList.value = uncompletedItems;
    };

    // 获取AQI详情
    const getAQIDetail = (level) => {
      return aqiStore.getAQIDetail(level);
    }

    // 显示序号
    const indexMethod = (index) => index + 1;

    onMounted(() => {
      locationStore.initLocationStore();
      fetchInfoList();
    });

    return {
      showContent,
      showCompleted,
      showUncompleted,
      infoList,
      uncompletedInfoList,
      completedInfoList,
      getProvince,
      getCity,
      getAQIDetail,
      indexMethod
    };
  },
}
</script>

<style>
.common-layout {
  padding: 20px;
}
.aqi-box {
  width: 80px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>