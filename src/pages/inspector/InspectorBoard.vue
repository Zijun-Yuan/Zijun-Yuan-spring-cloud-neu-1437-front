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
                v-if="uncompletedInfoList.length > pageSize"
                :current-page="uncompletedCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="uncompletedInfoList.length"
                @current-change="handleUncompletedPageChange"
            />
          </div>
          <div v-else-if="showContent === 'completed'" class="table-container">
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
            <!-- 分页控制 -->
            <el-pagination
                v-if="completedInfoList.length > pageSize"
                :current-page="completedCurrentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="completedInfoList.length"
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
    const pageSize = ref(10); // 每页数量
    const uncompletedCurrentPage = ref(1); // 当前页码
    const completedCurrentPage = ref(1); // 当前页码

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

    // 计算分页后未完成任务的数据
    const paginatedUncompletedList = computed(() => {
      const start = (uncompletedCurrentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return uncompletedInfoList.value.slice(start, end);
    });

    // 计算分页后已完成任务的数据
    const paginatedCompletedList = computed(() => {
      const start = (completedCurrentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return completedInfoList.value.slice(start, end);
    });

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
          if (item.status === 3) {
            completedItems.push(processedItem);
          } else if (item.status === 2) {
            uncompletedItems.push(processedItem);
          }
        }
      }
      completedInfoList.value = completedItems;
      uncompletedInfoList.value = uncompletedItems;
      updatePaginatedLists(); // 更新分页数据
    };

    // 更新分页后的任务列表
    const updatePaginatedLists = () => {
      paginatedUncompletedList.value = uncompletedInfoList.value.slice(
          (uncompletedCurrentPage.value - 1) * pageSize.value,
          uncompletedCurrentPage.value * pageSize.value
      );
      paginatedCompletedList.value = completedInfoList.value.slice(
          (completedCurrentPage.value - 1) * pageSize.value,
          completedCurrentPage.value * pageSize.value
      );
    };

    // 获取AQI详情
    const getAQIDetail = (level) => {
      return aqiStore.getAQIDetail(level);
    }

    // 显示未完成任务序号
    const indexMethodUncompleted = (index) => {
      return (uncompletedCurrentPage.value - 1) * pageSize.value + index + 1;
    };

    // 显示已完成任务序号
    const indexMethodCompleted = (index) => {
      return (completedCurrentPage.value - 1) * pageSize.value + index + 1;
    };

    // 处理菜单选择事件
    const handleSelect = (index) => {
      if (index === '1') {
        showUncompleted();
      } else if (index === '2') {
        showCompleted();
      } else if (index === '3') {
        showContent.value = 'profile';
      }
    }

    // 处理 "去检测" 按钮点击事件
    const handleCheck = (row) => {
      // 在这里执行去检测的逻辑
    };

    // 处理"驳回"按钮点击事件
    const handleReject = (row) => {
      // 在这里执行驳回的逻辑
    }

    // 页码变化处理函数
    const handleUncompletedPageChange = (page) => {
      uncompletedCurrentPage.value = page;
      // 重新计算分页数据
      updatePaginatedLists();
    };

    const handleCompletedPageChange = (page) => {
      completedCurrentPage.value = page;
      // 重新计算分页数据
      updatePaginatedLists();
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
      handleUncompletedPageChange,
      handleCompletedPageChange,
      inspectorStore,
      pageSize,
      uncompletedCurrentPage,
      completedCurrentPage
    };
  },
}
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
</style>