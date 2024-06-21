<template>
  <div class="common-layout">
    <el-container class="full-height">
      <el-header>
        <el-row>
          <el-col :span="21">
            <h5 class="mb-2">网格员工作台</h5>
          </el-col>
          <el-col :span="3" class="user-name">
            {{ inspectorStore.inspectorName }}
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="220px" class="menu-aside full-height">
          <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              @select="handleSelect"
          >
            <el-menu-item index="1">
              <el-icon><location /></el-icon>
              <span>待处理任务</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><document /></el-icon>
              <span>已完成任务</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><setting /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div v-if="showContent === 'uncompleted'" class="table-container">
            <!-- Combination Search Controls -->
            <el-row :gutter="20" class="mb-2">
              <el-col :span="8">
                <el-select v-model="filterProvince" placeholder="选择省份" clearable @change="handleFilterChange">
                  <el-option
                      v-for="province in provinceList"
                      :key="province.provinceId"
                      :label="province.provinceName"
                      :value="province.provinceId"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterCity" placeholder="选择城市" clearable @change="handleFilterChange">
                  <el-option
                      v-for="city in filteredCityList"
                      :key="city.cityCode"
                      :label="city.cityName"
                      :value="city.cityCode"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterAQI" placeholder="选择AQI级别" clearable @change="handleFilterChange">
                  <el-option
                      v-for="aqi in aqiLevelList"
                      :key="aqi.level"
                      :label="aqi.name"
                      :value="aqi.number"
                  />
                </el-select>
              </el-col>
            </el-row>

            <el-table :data="paginatedUncompletedList" :header-cell-style="{textAlign: 'center'}" border
                      height="590" stripe style="width: 100%" :row-style="{height: '0'}">
              <el-table-column type="index" label="序号" :index="indexMethodUncompleted" align="center" width="55" />
              <el-table-column label="省份" align="center" width="75">
                <template #default="{ row }">
                  <span>{{ row.province.provinceName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="城市" align="center" width="75">
                <template #default="{ row }">
                  <span>{{ row.city.cityName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="地址" align="center" width="200" />
              <el-table-column label="AQI" align="center" width="85">
                <template #default="{ row }">
                  <div v-if="row.aqiLevel !== undefined && row.aqiLevel !== null"
                       class="aqi-box"
                       :style="{ background: getAQIDetail(row.aqiLevel)?.color }">
                    <span>{{ getAQIDetail(row.aqiLevel)?.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="feedback" label="反馈信息" width="150" />
              <el-table-column prop="supervisorName" label="公众监督员" align="center" width="95" />
              <el-table-column prop="timeSupervisor" label="时间" align="center" width="170" />
              <el-table-column label="操作" align="center">
                <template #default="{ row }">
                  <el-button size="small" type="success" @click="handleCheck(row)">去检测</el-button>
                  <el-button size="small" type="danger" @click="handleReject(row)">驳回</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                v-if="filteredUncompletedList.length > pageSize"
                :current-page="uncompletedCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="filteredUncompletedList.length"
                @current-change="handleUncompletedPageChange"
            />
          </div>
          <div v-else-if="showContent === 'completed'" class="table-container">
            <!-- Combination Search Controls -->
            <el-row :gutter="20" class="mb-2">
              <el-col :span="8">
                <el-select v-model="filterProvince" placeholder="选择省份" clearable @change="handleFilterChange">
                  <el-option
                      v-for="province in provinceList"
                      :key="province.provinceId"
                      :label="province.provinceName"
                      :value="province.provinceId"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterCity" placeholder="选择城市" clearable @change="handleFilterChange">
                  <el-option
                      v-for="city in filteredCityList"
                      :key="city.cityCode"
                      :label="city.cityName"
                      :value="city.cityCode"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterAQI" placeholder="选择AQI级别" clearable @change="handleFilterChange">
                  <el-option
                      v-for="aqi in aqiLevelList"
                      :key="aqi.level"
                      :label="aqi.name"
                      :value="aqi.number"
                  />
                </el-select>
              </el-col>
            </el-row>

            <el-table :data="paginatedCompletedList" :header-cell-style="{textAlign: 'center'}" border
                      height="590" stripe style="width: 100%" :row-style="{height: '0'}">
              <el-table-column type="index" label="序号" :index="indexMethodCompleted" align="center" width="55" />
              <el-table-column label="省份" align="center" width="75">
                <template #default="{ row }">
                  <span>{{ row.province.provinceName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="城市" align="center" width="75">
                <template #default="{ row }">
                  <span>{{ row.city.cityName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="地址" align="center"  width="220" />
              <el-table-column label="AQI" align="center"  width="85">
                <template #default="{ row }">
                  <div v-if="row.aqiLevel !== undefined && row.aqiLevel !== null"
                       class="aqi-box"
                       :style="{ background: getAQIDetail(row.aqiLevel)?.color }">
                    <span>{{ getAQIDetail(row.aqiLevel)?.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="so2" label="二氧化硫(SO2)浓度" align="center" width="95" />
              <el-table-column prop="co" label="一氧化碳(CO)浓度" align="center" width="95" />
              <el-table-column prop="o3" label="臭氧(O3)浓度" align="center" width="95" />
              <el-table-column prop="pm25" label="PM2.5浓度" align="center" width="80" />
              <el-table-column prop="timeInspector" label="检测时间" align="center" />
            </el-table>
            <el-pagination
                v-if="filteredCompletedList.length > pageSize"
                :current-page="completedCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="filteredCompletedList.length"
                @current-change="handleCompletedPageChange"
            />
          </div>
          <div v-else-if="showContent === 'profile'" class="profile-container">
            <h2>个人信息</h2>
            <p>姓名: {{ inspectorStore.inspectorName }}</p>
            <p>编号: {{ inspectorStore.inspectorCode }}</p>
            <!-- 您可以在这里添加更多个人信息 -->
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { useInspectorStore } from '@/stores/inspectorStore';
import { getInfoList } from '@/api/inspector';
import { useLocationStore } from "@/stores/locationStore";
import { useAQIStore } from '@/stores/aqiLevelStore';

export default {
  name: 'InspectorBoard',
  setup() {
    const showContent = ref('uncompleted');
    const inspectorStore = useInspectorStore();
    const locationStore = useLocationStore();
    const aqiStore = useAQIStore();

    const infoList = ref([]);
    const uncompletedInfoList = ref([]);
    const completedInfoList = ref([]);
    const filteredUncompletedList = ref([]);
    const filteredCompletedList = ref([]);
    const provinceList = ref([]);
    const aqiLevelList = ref([]);
    const filterProvince = ref(null);
    const filterCity = ref(null);
    const filterAQI = ref(null);
    const pageSize = ref(10);
    const uncompletedCurrentPage = ref(1);
    const completedCurrentPage = ref(1);

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

    const filterLists = () => {
      const filterUncompleted = uncompletedInfoList.value.filter(item =>
          (!filterProvince.value || item.province.provinceId === filterProvince.value) &&
          (!filterCity.value || item.city.cityCode === filterCity.value) &&
          (!filterAQI.value || item.aqiLevel === filterAQI.value)
      );
      const filterCompleted = completedInfoList.value.filter(item =>
          (!filterProvince.value || item.province.provinceId === filterProvince.value) &&
          (!filterCity.value || item.city.cityCode === filterCity.value) &&
          (!filterAQI.value || item.aqiLevel === filterAQI.value)
      );
      filteredUncompletedList.value = filterUncompleted;
      filteredCompletedList.value = filterCompleted;
      updatePaginatedLists();
    };

    const handleFilterChange = () => {
      filterLists();
    };

    const paginatedUncompletedList = computed(() => {
      const start = (uncompletedCurrentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredUncompletedList.value.slice(start, end);
    });

    const paginatedCompletedList = computed(() => {
      const start = (completedCurrentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredCompletedList.value.slice(start, end);
    });

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
    };

    const getCity = async (cityCode) => {
      try {
        return await locationStore.getCityAndProvinceByCityCode(cityCode);
      } catch (error) {
        console.error('Failed to get city:', error);
        return { cityName: '' };
      }
    };

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
          if (item.status === 3) {
            completedItems.push(processedItem);
          } else if (item.status === 2) {
            uncompletedItems.push(processedItem);
          }
        }
      }
      completedInfoList.value = completedItems;
      uncompletedInfoList.value = uncompletedItems;
      filterLists();
    };

    const updatePaginatedLists = () => {
      paginatedUncompletedList.value = filteredUncompletedList.value.slice(
          (uncompletedCurrentPage.value - 1) * pageSize.value,
          uncompletedCurrentPage.value * pageSize.value
      );
      paginatedCompletedList.value = filteredCompletedList.value.slice(
          (completedCurrentPage.value - 1) * pageSize.value,
          completedCurrentPage.value * pageSize.value
      );
    };

    const getAQIDetail = (level) => {
      return aqiStore.getAQIDetail(level);
    };

    const indexMethodUncompleted = (index) => {
      return (uncompletedCurrentPage.value - 1) * pageSize.value + index + 1;
    };

    const indexMethodCompleted = (index) => {
      return (completedCurrentPage.value - 1) * pageSize.value + index + 1;
    };

    const handleSelect = (index) => {
      if (index === '1') {
        showUncompleted();
      } else if (index === '2') {
        showCompleted();
      } else if (index === '3') {
        showContent.value = 'profile';
      }
    };

    const handleCheck = (row) => {
      // Logic for going to check
    };

    const handleReject = (row) => {
      // Logic for rejecting
    };

    const handleUncompletedPageChange = (page) => {
      uncompletedCurrentPage.value = page;
      updatePaginatedLists();
    };

    const handleCompletedPageChange = (page) => {
      completedCurrentPage.value = page;
      updatePaginatedLists();
    };

    const computedFilteredCityList = computed(() => {
      return filterProvince.value ? locationStore.getCitiesByProvinceId(filterProvince.value) : [];
    });

    onMounted(async () => {
      await locationStore.initLocationStore();
      provinceList.value = await locationStore.getAllProvinces();
      aqiLevelList.value = aqiStore.getAllAQILevels();
      await fetchInfoList();
    });

    return {
      showContent,
      filterProvince,
      filterCity,
      filterAQI,
      provinceList,
      filteredCityList: computedFilteredCityList,
      showCompleted,
      showUncompleted,
      infoList,
      uncompletedInfoList,
      completedInfoList,
      filteredUncompletedList,
      filteredCompletedList,
      paginatedUncompletedList,
      paginatedCompletedList,
      getProvince,
      getCity,
      getAQIDetail,
      indexMethodUncompleted,
      indexMethodCompleted,
      handleCheck,
      handleReject,
      handleSelect,
      handleFilterChange,
      handleUncompletedPageChange,
      handleCompletedPageChange,
      inspectorStore,
      pageSize,
      uncompletedCurrentPage,
      completedCurrentPage,
      aqiLevelList
    };
  },
};
</script>

<style>
.full-height {
  height: 100vh;
}
.common-layout {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.menu-aside .el-menu {
  height: 100%;
}
.menu-aside {
  background-color: #20232A;
}
.user-name {
  text-align: right;
  line-height: 36px;
  font-size: 16px;
  color: white;
}
.table-container {
  margin-top: 0;
}
.el-table th {
  background-color: #f2f6fc;
  color: #606266;
  font-weight: bold;
}
.el-table td {
  padding: 12px 8px;
}
.aqi-box {
  width: 60px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.mb-2 {
  margin-bottom: 20px;
}
</style>