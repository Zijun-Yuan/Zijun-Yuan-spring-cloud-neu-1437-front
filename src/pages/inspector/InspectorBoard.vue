<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        反馈任务列表
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="showUncompleted">未完成</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="showCompleted">已完成</el-button>
          </el-col>
        </el-row>

        <div v-if="showContent === 'uncompleted'">
          <p>显示未完成的内容</p>
          <el-table :data="uncompletedInfoList">
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
            <el-table-column prop="aqiLevel" label="AQI" />
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="time" label="时间" />
          </el-table>
        </div>

        <div v-else-if="showContent === 'completed'">
          <p>显示已完成的内容</p>
          <el-table :data="completedInfoList">
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
            <el-table-column prop="aqiLevel" label="AQI" />
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="time" label="时间" />
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

export default {
  name: 'InspectorBoard',
  setup: function () {
    const showContent = ref('');
    const inspectorStore = useInspectorStore();
    const locationStore = useLocationStore();
    const infoList = ref([]);
    // const processedInfoList = ref([]);

    const uncompletedInfoList = ref([]);
    const completedInfoList = ref([]);

    const fetchInfoList = async () => {
      try {
        const inspectorCode = inspectorStore.inspectorCode;
        const response = await getInfoList(inspectorCode);
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

    const showUncompleted = async () => {
      showContent.value = 'uncompleted';
      await fetchInfoList();
    };

    const showCompleted = async () => {
      showContent.value = 'completed';
      await fetchInfoList();
    };

    const getProvince = async (cityCode) => {
      try {
        return await locationStore.getProvinceByCityCode(cityCode);
      } catch (error) {
        console.error('Failed to get province:', error);
        return { provinceName: '' };
      }
    }

    const getCity = async (cityCode) => {
      try {
        return await locationStore.getCityAndProvinceByCityCode(cityCode);
      } catch (error) {
        console.error('Failed to get city:', error);
        return { cityName: '' };
      }
    }

    const processInfoList = async () => {
      const items = infoList.value;
      const uncompletedItems = [];
      const completedItems = [];
      // const processedItems = [];

      for (const item of items) {
        const province = await getProvince(item.cityCode);
        const city = await getCity(item.cityCode);
        if (province && city) {
          // processedItems.push({
          //   ...item,
          //   province: province,
          //   city: city
          // });
          const processedItem = {
            ...item,
            province: province,
            city: city
          };

          if (item.status === 3) {
            completedItems.push(processedItem);
          } else if (item.status === 2) {
            uncompletedItems.push(processedItem);
          }
        }
      }
      // processedInfoList.value = processedItems;
      completedInfoList.value = completedItems;
      uncompletedInfoList.value = uncompletedItems;
    };

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
      // processedInfoList,
      getProvince,
      getCity,
    };
  },
}
</script>

<style>
.common-layout {
  padding: 20px;
}
</style>