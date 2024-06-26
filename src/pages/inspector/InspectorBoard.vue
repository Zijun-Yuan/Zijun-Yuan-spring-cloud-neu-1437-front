<template>
  <div class="common-layout">
    <el-container class="full-height">
      <el-header>
        <el-row>
          <el-col :span="22">
            <h5 class="mb-2">网格员工作台</h5>
          </el-col>
          <el-col :span="2" class="user-info" text-align="right">
            <h5 class="mb-2">欢迎您，{{ inspectorStore.realName }}</h5>
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
            <el-row :gutter="20" class="mb-2">
              <el-col :span="8">
                <el-select v-model="filterProvince" size="small" placeholder="选择省份" clearable @change="handleFilterChange">
                  <el-option
                      v-for="province in provinceList"
                      :key="province.provinceId"
                      :label="province.provinceName"
                      :value="province.provinceId"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterCity" size="small" placeholder="选择城市" clearable @change="handleFilterChange">
                  <el-option
                      v-for="city in filteredCityList"
                      :key="city.cityCode"
                      :label="city.cityName"
                      :value="city.cityCode"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterAQI" size="small" placeholder="选择AQI级别" clearable @change="handleFilterChange">
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
                class="pagination-container"
            />
          </div>

          <div v-else-if="showContent === 'completed'" class="table-container">
            <el-row :gutter="20" class="mb-2">
              <el-col :span="8">
                <el-select v-model="filterProvince" size="small" placeholder="选择省份" clearable @change="handleFilterChange">
                  <el-option
                      v-for="province in provinceList"
                      :key="province.provinceId"
                      :label="province.provinceName"
                      :value="province.provinceId"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterCity" size="small" placeholder="选择城市" clearable @change="handleFilterChange">
                  <el-option
                      v-for="city in filteredCityList"
                      :key="city.cityCode"
                      :label="city.cityName"
                      :value="city.cityCode"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterAQI" size="small" placeholder="选择AQI级别" clearable @change="handleFilterChange">
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
                :align="center"
                @current-change="handleCompletedPageChange"
                class="pagination-container"
            />
          </div>

          <div v-else-if="showContent === 'profile'" class="profile-container">
            <h2>个人信息</h2>
            <p>姓名: {{ inspectorStore.realName }}</p>
            <p>编号: {{ inspectorStore.inspectorCode }}</p>
            <!-- 您可以在这里添加更多个人信息 -->
          </div>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog v-model="dialogVisible">
      <el-descriptions
          title="基本信息"
          :column="2"
          border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              网格信息
            </div>
          </template>
          <el-tag>{{ currentRow.province.provinceName }} -- {{ currentRow.city.cityName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <office-building />
              </el-icon>
              详细地址
            </div>
          </template>
          {{ currentRow.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <tickets />
              </el-icon>
              AQI预估
            </div>
          </template>
          <div v-if="currentRow.aqiLevel !== undefined && currentRow.aqiLevel !== null"
               class="aqi-box"
               :style="{ background: getAQIDetail(currentRow.aqiLevel)?.color }">
            <span>{{ getAQIDetail(currentRow.aqiLevel)?.name }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <tickets />
              </el-icon>
              反馈信息
            </div>
          </template>
          {{ currentRow.feedback }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              公众监督员
            </div>
          </template>
          {{ currentRow.supervisorName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              监督时间
            </div>
          </template>
          {{ currentRow.timeSupervisor }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form :model="currentRow" label-width="120px" class="mt-2" size="small">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="SO2浓度：">
              <el-input v-model="so2Number" placeholder="输入SO2浓度">
                <template #append>ug/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <div class="aqi-box-number"
                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiSO2))?.color }">
              <span>{{ getAQIDetail(getAQILevelByCheck(aqiSO2))?.level }}</span>
            </div>
          </el-col>
          <el-col :span="11">
            <el-form-item label="CO浓度：">
              <el-input v-model="coNumber" placeholder="输入CO浓度">
                <template #append>mg/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <div class="aqi-box-number"
                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiCO))?.color }">
              <span>{{ getAQIDetail(getAQILevelByCheck(aqiCO))?.level }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="O3浓度：">
              <el-input v-model="o3Number" placeholder="输入O3浓度">
                <template #append>ug/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <div class="aqi-box-number"
                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiO3))?.color }">
              <span>{{ getAQIDetail(getAQILevelByCheck(aqiO3))?.level }}</span>
            </div>
          </el-col>
          <el-col :span="11">
            <el-form-item label="PM2.5浓度：">
              <el-input v-model="pm25Number" placeholder="输入PM2.5浓度">
                <template #append>ug/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <div class="aqi-box-number"
                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiPM25))?.color }">
              <span>{{ getAQIDetail(getAQILevelByCheck(aqiPM25))?.level }}</span>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-container">
        <el-button type="primary" @click="submitInspection">确认提交</el-button>
        <el-button @click="dialogVisible = false, so2Number.value = 0, coNumber.value = 0,
          o3Number.value = 0, pm25Number.value = 0">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {onMounted, ref, computed, watch} from 'vue';
import { useInspectorStore } from '@/stores/inspectorStore';
import { getInfoList, feedbackInfo, getInspectorByCode } from '@/api/inspector';
import { useLocationStore } from "@/stores/locationStore";
import { useAQIStore } from '@/stores/aqiLevelStore';
import {ElMessage} from "element-plus";

export default {
  name: 'InspectorBoard',
  setup() {
    const showContent = ref('uncompleted');
    const inspectorStore = useInspectorStore();
    const locationStore = useLocationStore();
    const aqiStore = useAQIStore();

    let dialogVisible = ref(false);
    let currentRow = ref({});
    let so2Number = ref(0);
    let coNumber = ref(0);
    let o3Number = ref(0);
    let pm25Number = ref(0);
    let infoChange = ref({
      infoId: '',
      status: 3,
      aqiLevel: '',
      cityCode: '',
      address: '',
      feedback: '',
      timeSupervisor: '',
      timeInspector: '',
      so2: '',
      co: '',
      o3: '',
      pm25: '',
      supervisorName: '',
      inspectorName: ''
    });

    let infoList = ref([]);
    let uncompletedInfoList = ref([]);
    let completedInfoList = ref([]);
    let filteredUncompletedList = ref([]);
    let filteredCompletedList = ref([]);
    let provinceList = ref([]);
    let aqiLevelList = ref([]);
    let filterProvince = ref(null);
    let filterCity = ref(null);
    let filterAQI = ref(null);
    let filteredCityList = ref([]);
    let pageSize = ref(10);
    let uncompletedCurrentPage = ref(1);
    let completedCurrentPage = ref(1);

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
      currentRow.value = row;
      dialogVisible.value = true;
    };

    const handleUncompletedPageChange = (page) => {
      uncompletedCurrentPage.value = page;
      updatePaginatedLists();
    };

    const handleCompletedPageChange = (page) => {
      completedCurrentPage.value = page;
      updatePaginatedLists();
    };

    const handleProvinceChange = async (provinceId) => {
      filteredCityList.value = await locationStore.getCitiesByProvinceId(provinceId);
      filterCity.value = null; // 重置城市选择
    };

    const submitInspection = () => {
      infoChange.value.infoId = currentRow.value.infoId;
      infoChange.value.cityCode = currentRow.value.cityCode;
      infoChange.value.address = currentRow.value.address;
      infoChange.value.feedback = currentRow.value.feedback;
      infoChange.value.timeSupervisor = currentRow.value.timeSupervisor;
      infoChange.value.timeInspector = new Date().toISOString().slice(0, 19);
      infoChange.value.so2 = so2Number.value;
      infoChange.value.co = coNumber.value;
      infoChange.value.o3 = o3Number.value;
      infoChange.value.pm25 = pm25Number.value;
      infoChange.value.aqiLevel = Math.max(
          getAQILevelByCheck(aqiSO2.value),
          getAQILevelByCheck(aqiCO.value),
          getAQILevelByCheck(aqiO3.value),
          getAQILevelByCheck(aqiPM25.value));
      infoChange.value.supervisorName = currentRow.value.supervisorName;
      infoChange.value.inspectorName = inspectorStore.realName;

      feedbackInfo(infoChange.value);
      ElMessage({
        message: '上传成功！',
        type: 'success',
      })
      dialogVisible.value = false;
      so2Number.value = 0;
      coNumber.value = 0;
      o3Number.value = 0;
      pm25Number.value = 0;
    };

    watch(filterProvince, (provinceId) => {
      if (provinceId) {
        handleProvinceChange(provinceId);
      } else {
        filteredCityList.value = [];
      }
    });

    onMounted(async () => {
      await locationStore.initLocationStore();
      provinceList.value = await locationStore.getAllProvinces();
      aqiLevelList.value = aqiStore.getAllAQILevels();
      await fetchInfoList();
    });

    const getAQIDetail = (level) => {
      return aqiStore.getAQIDetail(level);
    };

    const getAQILevelByCheck = (check) => {
      return aqiStore.getAQILevelByCheck(check);
    };

    const aqiSO2 = computed(() => {
      return calculateAQI_SO2(so2Number.value);
    });

    const aqiCO = computed(() => {
      return calculateAQI_CO(coNumber.value);
    });

    const aqiO3 = computed(() => {
      return calculateAQI_O3(o3Number.value);
    });

    const aqiPM25 = computed(() => {
      return calculateAQI_PM25(pm25Number.value);
    });

    function calculateAQI_SO2(so2Number) {
      if (so2Number >= 0 && so2Number <= 50) {
        return so2Number;
      } else if (so2Number > 50 && so2Number <= 150) {
        return 50 + (50 * (so2Number - 50) / 100);
      } else if (so2Number > 150 && so2Number <= 475) {
        return 100 + (50 * (so2Number - 150) / 325);
      } else if (so2Number > 475 && so2Number <= 800) {
        return 150 + (50 * (so2Number - 475) / 325);
      } else if (so2Number > 800 && so2Number <= 1600) {
        return 200 + (100 * (so2Number - 800) / 800);
      } else if (so2Number > 1600 && so2Number <= 2100) {
        return 300 + (100 * (so2Number - 1600) / 500);
      } else if (so2Number > 2100 && so2Number <= 2620) {
        return 400 + (100 * (so2Number - 2100) / 520);
      } else if (so2Number > 2620) {
        return 500;
      } else {
        return 0;
      }
    }

    function calculateAQI_CO(coNumber) {
      if (coNumber >= 0 && coNumber <= 2) {
        return coNumber * 50 / 2;
      } else if (coNumber > 2 && coNumber <= 4) {
        return 50 + (50 * (coNumber - 2) / 2);
      } else if (coNumber > 4 && coNumber <= 14) {
        return 100 + (100 * (coNumber - 4) / 10);
      } else if (coNumber > 14 && coNumber <= 24) {
        return 200 + (100 * (coNumber - 14) / 10);
      } else if (coNumber > 24 && coNumber <= 36) {
        return 300 + (100 * (coNumber - 24) / 12);
      } else if (coNumber > 36 && coNumber <= 48) {
        return 400 + (100 * (coNumber - 36) / 12);
      } else if (coNumber > 48) {
        return 500;
      } else {
        return 0;
      }
    }

    function calculateAQI_O3(o3Number) {
      if (o3Number >= 0 && o3Number <= 160) {
        return o3Number * 50 / 160;
      } else if (o3Number > 160 && o3Number <= 200) {
        return 50 + (50 * (o3Number - 160) / 40);
      } else if (o3Number > 200 && o3Number <= 300) {
        return 100 + (100 * (o3Number - 200) / 100);
      } else if (o3Number > 300 && o3Number <= 400) {
        return 200 + (100 * (o3Number - 300) / 100);
      } else if (o3Number > 400 && o3Number <= 800) {
        return 300 + (100 * (o3Number - 400) / 400);
      } else if (o3Number > 800 && o3Number <= 1000) {
        return 400 + (100 * (o3Number - 800) / 200);
      } else if (o3Number > 1000) {
        return 500;
      } else {
        return 0;
      }
    }

    function calculateAQI_PM25(pm25Number) {
      if (pm25Number >= 0 && pm25Number <= 35) {
        return pm25Number * 50 / 35;
      } else if (pm25Number > 35 && pm25Number <= 75) {
        return 50 + (50 * (pm25Number - 35) / 40);
      } else if (pm25Number > 75 && pm25Number <= 115) {
        return 100 + (50 * (pm25Number - 75) / 40);
      } else if (pm25Number > 115 && pm25Number <= 150) {
        return 150 + (50 * (pm25Number - 115) / 35);
      } else if (pm25Number > 150 && pm25Number <= 250) {
        return 200 + (100 * (pm25Number - 150) / 100);
      } else if (pm25Number > 250 && pm25Number <= 350) {
        return 300 + (100 * (pm25Number - 250) / 100);
      } else if (pm25Number > 350 && pm25Number <= 500) {
        return 400 + (100 * (pm25Number - 350) / 150);
      } else if (pm25Number > 500) {
        return 500;
      } else {
        return 0;
      }
    }

    return {
      showContent,
      filterProvince,
      filterCity,
      filterAQI,
      provinceList,
      filteredCityList,
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
      handleSelect,
      handleFilterChange,
      handleUncompletedPageChange,
      handleCompletedPageChange,
      inspectorStore,
      pageSize,
      uncompletedCurrentPage,
      completedCurrentPage,
      aqiLevelList,
      dialogVisible,
      currentRow,
      so2Number,
      coNumber,
      o3Number,
      pm25Number,
      infoChange,
      submitInspection,
      getAQILevelByCheck,
      aqiSO2,
      aqiCO,
      aqiO3,
      aqiPM25,
      calculateAQI_SO2,
      calculateAQI_CO,
      calculateAQI_O3,
      calculateAQI_PM25
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
.aqi-box-number {
  width: 25px;
  height: 25px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.mb-2 {
  margin-bottom: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.mt-2 {
  margin-top: 20px;
  margin-left: -30px;
  margin-right: 40px;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-right: 10px;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>