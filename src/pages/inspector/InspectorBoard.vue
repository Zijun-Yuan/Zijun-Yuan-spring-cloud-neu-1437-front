<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        反馈任务列表
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="showCompleted">已完成</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="showUncompleted">未完成</el-button>
          </el-col>
        </el-row>

        <div v-if="showContent === 'completed'">
          <p>显示已完成的内容</p>
          <el-table :data="infoList">
<!--            <el-table-column label="省份">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{......................................{getProvince(scope.row.cityCode).provinceName}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="城市">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{getCity(getProvince(scope.row.cityCode).provinceId).cityName}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
            <el-table-column prop="aqiLevel" label="AQI" />
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="time" label="时间" />
          </el-table>
        </div>
        <div v-else-if="showContent === 'uncompleted'">
          <p>显示未完成的内容</p>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
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

    const fetchInfoList = async () => {
      try {
        const inspectorCode = inspectorStore.inspectorCode;
        const response = await getInfoList(inspectorCode);

        if (response.data.code === 0) {
          infoList.value = response.data.data;
          // console.log(infoList);

        } else {
          console.error('Failed to fetch info list:', response.data.message);
        }
      } catch (error) {
        console.error('Error during fetching info list:', error);
      }
    };

    const showCompleted = () => {
      showContent.value = 'completed';
      fetchInfoList();
    };

    const showUncompleted = () => {
      showContent.value = 'uncompleted';
      fetchInfoList();
    };

    const getProvince = (cityCode) => {
      return locationStore.getProvinceByCityCode(cityCode);
    }

    const getCity = (provinceId) => {
      return locationStore.getCitiesByProvinceId(provinceId);
    }

    onMounted(() => {
      fetchInfoList();
    });

    return {
      showContent,
      showCompleted,
      showUncompleted,
      infoList,
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