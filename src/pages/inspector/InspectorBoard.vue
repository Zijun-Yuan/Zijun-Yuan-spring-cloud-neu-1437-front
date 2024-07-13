<template>
  <div class="common-layout">
    <el-container class="full-height" heigth="100%">
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

        <!-- 左侧菜单：1：待处理任务 2：已完成任务 3：个人信息 -->
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

        <!-- 待处理任务的筛选栏设置，这里包含省份、城市、AQI三种筛选条件，使用el-select -->
        <el-main>
          <div v-if="showContent === 'uncompleted'" class="table-container">
            <el-row :gutter="20" class="mb-2">
              <el-col :span="8">
                <el-select v-model="filterProvince" size="medium" placeholder="选择省份" clearable @change="handleFilterChange">
                  <el-option
                      v-for="province in provinceList"
                      :key="province.provinceId"
                      :label="province.provinceName"
                      :value="province.provinceId"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterCity" size="medium" placeholder="选择城市" clearable @change="handleFilterChange" :disabled="!filterProvince">
                  <el-option
                      v-for="city in filteredCityList"
                      :key="city.cityCode"
                      :label="city.cityName"
                      :value="city.cityCode"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterAQI" size="medium" placeholder="选择AQI级别" clearable @change="handleFilterChange">
                  <el-option
                      v-for="aqi in aqiLevelList"
                      :key="aqi.level"
                      :label="aqi.name"
                      :value="aqi.number"
                  />
                </el-select>
              </el-col>
            </el-row>

            <!-- 待处理任务表格展示 -->
            <el-table :data="paginatedUncompletedList" :header-cell-style="{textAlign: 'center'}" border
                      height="640" stripe style="width: 100%" :row-style="{height: '60px'}">
              <el-table-column type="index" label="序号" :index="indexMethodUncompleted" align="center" width="55" />
              <el-table-column label="省份" align="center" width="150">
                <template #default="{ row }">
                  <span>{{ row.province.provinceName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="城市" align="center" width="95">
                <template #default="{ row }">
                  <span>{{ row.city.cityName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="地址" align="center" width="300" />
              <el-table-column label="AQI" align="center" width="85">
                <template #default="{ row }">
                  <div v-if="row.aqiLevel !== undefined && row.aqiLevel !== null"
                       class="aqi-box"
                       :style="{ background: getAQIDetail(row.aqiLevel)?.color }">
                    <span>{{ getAQIDetail(row.aqiLevel)?.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="feedback" label="反馈信息" width="185" />
              <el-table-column prop="supervisorName" label="公众监督员" align="center" width="95" />
<!--              <el-table-column prop="timeSupervisor" label="时间" align="center" width="190" />-->
              <el-table-column label="时间" align="center" width="210">
                <template #default="{ row }">
                  <span>{{ formatTime(row.timeSupervisor) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center"  width="93" >
                <template #default="{ row }">
                  <el-button size="small" type="success" @click="handleCheck(row)">去检测</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页设置 -->
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

          <!-- 已完成任务的筛选栏设置，这里包含省份、城市、AQI三种筛选条件，使用el-select -->
          <div v-else-if="showContent === 'completed'" class="table-container">
            <el-row :gutter="20" class="mb-2">
              <el-col :span="8">
                <el-select v-model="filterProvince" size="medium" placeholder="选择省份" clearable @change="handleFilterChange">
                  <el-option
                      v-for="province in provinceList"
                      :key="province.provinceId"
                      :label="province.provinceName"
                      :value="province.provinceId"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterCity" size="medium" placeholder="选择城市" clearable @change="handleFilterChange" :disabled="!filterProvince">
                  <el-option
                      v-for="city in filteredCityList"
                      :key="city.cityCode"
                      :label="city.cityName"
                      :value="city.cityCode"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="filterAQI" size="medium" placeholder="选择AQI级别" clearable @change="handleFilterChange">
                  <el-option
                      v-for="aqi in aqiLevelList"
                      :key="aqi.level"
                      :label="aqi.name"
                      :value="aqi.number"
                  />
                </el-select>
              </el-col>
            </el-row>

            <!-- 已完成任务表格展示 -->
            <el-table :data="paginatedCompletedList" :header-cell-style="{textAlign: 'center'}" border
                      height="664" stripe style="width: 100%" :row-style="{height: '60px'}">
              <el-table-column type="index" label="序号" :index="indexMethodCompleted" align="center" width="55" />
              <el-table-column label="省份" align="center" width="140">
                <template #default="{ row }">
                  <span>{{ row.province.provinceName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="城市" align="center" width="85">
                <template #default="{ row }">
                  <span>{{ row.city.cityName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="地址" align="center"  width="300" />
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
              <el-table-column prop="pm25" label="PM2.5浓度" align="center" width="100" />
<!--              <el-table-column prop="timeInspector" label="检测时间" align="center" />-->
              <el-table-column label="时间" align="center">
                <template #default="{ row }">
                  <span>{{ formatTime(row.timeInspector) }}</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页设置 -->
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

<!--          &lt;!&ndash; 个人信息展示 &ndash;&gt;-->
<!--          <div v-else-if="showContent === 'profile'" class="profile-container">-->
<!--            <h2>个人信息</h2>-->
<!--            <p>姓名: {{ inspectorStore.realName }}</p>-->
<!--            <p>编号: {{ inspectorStore.inspectorCode }}</p>-->
<!--            &lt;!&ndash; 您可以在这里添加更多个人信息 &ndash;&gt;-->
<!--          </div>-->
          <!-- 个人信息展示 -->
          <div v-else-if="showContent === 'profile'" class="profile-container">
            <h2>{{ inspectorStore.realName }}您好，您的个人信息如下</h2>
            <el-card>
              <el-descriptions title="网格员基本信息表" border column="1" class="descriptions-custom">
                <el-descriptions-item label="网格员姓名" align="center">
                  {{ inspectorStore.realName }}
                </el-descriptions-item>
                <el-descriptions-item label="所属ID" align="center">
                  <el-tag size="small">{{ inspectorStore.inspectorId }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="网格员编号（账号）" align="center">
                  {{ inspectorStore.inspectorCode }}
                </el-descriptions-item>
                <el-descriptions-item label="联系方式" align="center">
                  {{ inspectorStore.telNum }}
                </el-descriptions-item>
                <el-descriptions-item label="居住地址" align="center">
<!--                  <el-tag size="small">{{ cityInfo.province }} &#45;&#45; {{ cityInfo.city }}</el-tag>-->
                  {{ cityInfo.province }} -- {{ cityInfo.city }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>

        </el-main>
      </el-container>
    </el-container>

    <!-- 弹窗：检测详情上传，包含详细信息、气体浓度等内容 -->
    <!-- 这里使用el-dialog组件，通过控制dialogVisible变量的显示和隐藏来实现弹窗的显示和隐藏 -->
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

      <!-- 上传气体浓度信息 -->
      <el-form :model="currentRow" label-width="120px" class="mt-2" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="SO2浓度：">
              <el-input v-model="so2Number" placeholder="输入SO2浓度" @input="validateSO2">
                <template #append>ug/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="1">-->
<!--            <div class="aqi-box-number"-->
<!--                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiSO2))?.color }">-->
<!--              <span>{{ getAQIDetail(getAQILevelByCheck(aqiSO2))?.level }}</span>-->
<!--            </div>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="CO浓度：">
              <el-input v-model="coNumber" placeholder="输入CO浓度" @input="validateCO">
                <template #append>mg/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="1">-->
<!--            <div class="aqi-box-number"-->
<!--                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiCO))?.color }">-->
<!--              <span>{{ getAQIDetail(getAQILevelByCheck(aqiCO))?.level }}</span>-->
<!--            </div>-->
<!--          </el-col>-->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="O3浓度：">
              <el-input v-model="o3Number" placeholder="输入O3浓度" @input="validateO3">
                <template #append>ug/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="1">-->
<!--            <div class="aqi-box-number"-->
<!--                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiO3))?.color }">-->
<!--              <span>{{ getAQIDetail(getAQILevelByCheck(aqiO3))?.level }}</span>-->
<!--            </div>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="PM2.5浓度：">
              <el-input v-model="pm25Number" placeholder="输入PM2.5浓度" @input="validatePM25">
                <template #append>ug/m3</template>
              </el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="1">-->
<!--            <div class="aqi-box-number"-->
<!--                 :style="{ background: getAQIDetail(getAQILevelByCheck(aqiPM25))?.color }">-->
<!--              <span>{{ getAQIDetail(getAQILevelByCheck(aqiPM25))?.level }}</span>-->
<!--            </div>-->
<!--          </el-col>-->
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
    // 页面初始化时，获取个人信息、气象站信息、AQI等级信息
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
      inspectorName: '',
      aqiReal: 0,
    });
    let cityInfo = ref({
      province: '',
      city: '',
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

    // 左侧菜单点击事件
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

    // 获取相关表格的列表，通过inspectorCode识别用户身份给出对应列表
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

    // 处理信息列表，这里主要是对数据筛选的处理
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

    // 分页相关的计算属性（待处理）
    const paginatedUncompletedList = computed(() => {
      const start = (uncompletedCurrentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredUncompletedList.value.slice(start, end);
    });

    // 分页相关的计算属性（已完成）
    const paginatedCompletedList = computed(() => {
      const start = (completedCurrentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredCompletedList.value.slice(start, end);
    });

    // 分页更新方法
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

    // 待处理表格分页相关的计算属性
    const handleUncompletedPageChange = (page) => {
      uncompletedCurrentPage.value = page;
      updatePaginatedLists();
    };

    // 已完成表格分页相关的计算属性
    const handleCompletedPageChange = (page) => {
      completedCurrentPage.value = page;
      updatePaginatedLists();
    };

    // 表格的索引计算方法
    const indexMethodUncompleted = (index) => {
      return (uncompletedCurrentPage.value - 1) * pageSize.value + index + 1;
    };

    const indexMethodCompleted = (index) => {
      return (completedCurrentPage.value - 1) * pageSize.value + index + 1;
    };

    // 待处理表格展示
    const showUncompleted = async () => {
      showContent.value = 'uncompleted';
      await fetchInfoList();
    };

    // 已完成表格展示
    const showCompleted = async () => {
      showContent.value = 'completed';
      await fetchInfoList();
    };

    // 获取省份筛选列表
    const getProvince = async (cityCode) => {

      try {
        return await locationStore.getProvinceByCityCode(cityCode);
      } catch (error) {
        console.error('Failed to get province:', error);
        return { provinceName: '' };
      }
    };

    // 获取城市筛选列表
    const getCity = async (cityCode) => {
      try {
        return await locationStore.getCityAndProvinceByCityCode(cityCode);
      } catch (error) {
        console.error('Failed to get city:', error);
        return { cityName: '' };
      }
    };

    // 级联查询时，获取城市列表的方法
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

      // 为 已完成列表的任务 按照 timeInspector 排序，时间越近越靠前
      completedItems.sort((a, b) => new Date(b.timeInspector) - new Date(a.timeInspector));
      // 为 待完成列表的任务 按照 timeSupervisor 排序，时间越远越靠前
      uncompletedItems.sort((a, b) => new Date(a.timeSupervisor) - new Date(b.timeSupervisor));

      completedInfoList.value = completedItems;
      uncompletedInfoList.value = uncompletedItems;
      filterLists();
    };

    // 级联查询时，select组件的change事件处理方法
    const handleProvinceChange = async (provinceId) => {
      filteredCityList.value = await locationStore.getCitiesByProvinceId(provinceId);
      filterCity.value = null; // 重置城市选择
    };

    // 城市列表的级联处理方法
    watch(filterProvince, (provinceId) => {
      if (provinceId) {
        handleProvinceChange(provinceId);
      } else {
        filterCity.value = null; // 重置城市选择
        fetchInfoList();
      }
    });

    // 信息上传处理方法
    const submitInspection = () => {
      infoChange.value.infoId = currentRow.value.infoId;
      infoChange.value.cityCode = currentRow.value.cityCode;
      infoChange.value.address = currentRow.value.address;
      infoChange.value.feedback = currentRow.value.feedback;
      infoChange.value.timeSupervisor = currentRow.value.timeSupervisor;
      // 0-19是因为日期格式为YYYY-MM-DD HH:mm:ss，这里只取到到时分秒
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

      fetchInfoList();
      window.location.reload();
    };

    watch(infoList, async (newVal) => {
      await processInfoList();
    }, { immediate: true });

    // 监听filterProvince变化，更新filteredCityList
    watch(filterProvince, (provinceId) => {
      if (provinceId) {
        handleProvinceChange(provinceId);
      } else {
        filteredCityList.value = [];
      }
    });

    // 个人信息中的城市信息获取
    const fetchCityInfo = async () => {
      try {
        const cityData = await locationStore.getCityAndProvinceByCityCode(inspectorStore.cityCode);
        const provinceData = await locationStore.getProvinceByCityCode(inspectorStore.cityCode);

        if (cityData && provinceData) {
          cityInfo.value.city = cityData.cityName;
          cityInfo.value.province = provinceData.provinceName;
        }
      } catch (error) {
        console.error('Failed to fetch city info:', error);
      }
    };

    onMounted(async () => {
      const token = localStorage.getItem('inspector-token');
      inspectorStore.setToken(token);
      await locationStore.initLocationStore();
      provinceList.value = await locationStore.getAllProvinces();
      aqiLevelList.value = aqiStore.getAllAQILevels();
      await fetchInfoList();
      document.body.style.overflow = 'hidden';
      await fetchCityInfo();
    });

    // 以下为AQI的对应计算部分逻辑，分别对应详细信息以及SO2、CO、O3、PM2.5四个气体的计算方法
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

    const calculateAQI_SO2 = (so2Number) => {
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

    const calculateAQI_CO = (coNumber) => {
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

    const calculateAQI_O3 = (o3Number) => {
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

    const calculateAQI_PM25 = (pm25Number) => {
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

    // 表单验证方法
    const validateSO2 = (value) => {
      if (isNaN(value)) {
        so2Number.value = 0;
        ElMessage({
          message: '请输入有效的SO2数值',
          type: 'warning',
        })
      } else if (value < 0 || value > 2620) {
        so2Number.value = 0;
        ElMessage({
          message: '输入的SO2数值必须在 0 到 2620 之间',
          type: 'warning',
        })
      }
    };

    const validateCO = (value) => {
      if (isNaN(value)) {
        coNumber.value = 0;
        ElMessage({
          message: '请输入有效的CO数值',
          type: 'warning',
        })
      } else if (value < 0 || value > 48) {
        coNumber.value = 0;
        ElMessage({
          message: '输入的CO数值必须在 0 到 48 之间',
          type: 'warning',
        })
      }
    };

    const validateO3 = (value) => {
      if (isNaN(value)) {
        o3Number.value = 0;
        ElMessage({
          message: '请输入有效的O3数值',
          type: 'warning',
        })
      } else if (value < 0 || value > 1000) {
        o3Number.value = 0;
        ElMessage({
          message: '输入的O3数值必须在 0 到 1000 之间',
          type: 'warning',
        })
      }
    };

    const validatePM25 = (value) => {
      if (isNaN(value)) {
        pm25Number.value = 0;
        ElMessage({
          message: '请输入有效的PM2.5数值',
          type: 'warning',
        })
      } else if (value < 0 || value > 500) {
        pm25Number.value = 0;
        ElMessage({
          message: '输入的PM2.5数值必须在 0 到 500 之间',
          type: 'warning',
        })
      }
    };

    // 格式化时间方法
    const formatTime = (time) => {
      if (!time) return '';
      const date = new Date(time);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${year}年${month}月${day}日--${hours}:${minutes}:${seconds}`;
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
      cityInfo,
      submitInspection,
      getAQILevelByCheck,
      aqiSO2,
      aqiCO,
      aqiO3,
      aqiPM25,
      calculateAQI_SO2,
      calculateAQI_CO,
      calculateAQI_O3,
      calculateAQI_PM25,
      fetchCityInfo,
      validateSO2,
      validateCO,
      validateO3,
      validatePM25,
      formatTime
    };
  },
};
</script>

<style>
.full-height {
  height: 100vh;
  overflow: hidden;
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

.profile-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center; /* Center align all text */
}
.profile-container h2 {
  margin-bottom: 20px;
  text-align: center;
}
.el-card {
  padding: 20px;
}
.descriptions-custom .el-descriptions__label {
  width: 150px; /* Adjust label width */
  text-align: right; /* Right align label text */
  display: inline-block;
}
.descriptions-custom .el-descriptions__content {
  width: calc(100% - 150px); /* Adjust content width */
  text-align: left; /* Left align content text */
  display: inline-block;
}
.el-descriptions {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}
.el-descriptions-item {
  padding: 10px 0;
}
</style>