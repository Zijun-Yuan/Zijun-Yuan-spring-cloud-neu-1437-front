<template>
  <div class="common-layout">
    <el-container>
      <el-header class="layout-header">东软环保公众监督平台管理系统</el-header>
      <el-container class="layout-container-demo" style="height: 100vh;">
        <el-aside width="200px">
          <el-scrollbar>
            <el-menu :default-openeds="['1', '3']" class="custom-menu" @select="handleSelect">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <Message/>
                  </el-icon>
                  <span class="menu-title">公众监督数据管理</span>
                </template>
                <el-menu-item index="1-1" @click="initTable1">公众监督数据列表</el-menu-item>
                <el-menu-item index="1-2" @click="initTable3">确认AQI数据列表</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon>
                    <IconMenu/>
                  </el-icon>
                  <span class="menu-title">统计数据管理</span>
                </template>
                <el-menu-item index="2-1"
                              @click="getProvinceGroupedInspectionStats">省分组检查统计
                </el-menu-item>
                <el-menu-item index="2-2" @click="getAQIDistributionStats">AQI指数分布统计</el-menu-item>
                <el-menu-item index="2-3" @click="getAQITrendStats">AQI指数趋势统计</el-menu-item>
                <el-menu-item index="2-4" @click="getOtherDataStats">其他数据统计</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <el-icon>
                    <Setting/>
                  </el-icon>
                  <span class="menu-title">网格数据管理</span>
                </template>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>

        <el-container>
          <el-header style="text-align: left; font-size: 12px">
            <div class="toolbar">
              <span>{{ formattedTitle }}</span>
            </div>
          </el-header>

          <el-main>
            <el-scrollbar>

              <div v-if="currentTable === 'table1'||currentTable === 'table2'"
                   style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px ">
                <el-row :gutter="24" style="color: gray;">
                  <el-col :span="4">
											<span>省区域
												<el-select v-model="selectedProvince" placeholder="—全部—"
                                   @change="handleProvinceChange" style="width: 130px;">
													<el-option v-for="province in provinces" :key="province.provinceId"
                                     :label="province.provinceName" :value="province.provinceId"/>
												</el-select>
											</span>
                  </el-col>
                  <el-col :span="4">
											<span>市区域
												<el-select v-model="selectedCity" :disabled="!selectedProvince"
                                   placeholder="—全部—" style="width: 120px;">
													<el-option v-for="city in cities" :key="city.cityCode"
                                     :label="city.cityName" :value="city.cityCode"/>
												</el-select>
											</span>
                  </el-col>
                  <el-col :span="4">
											<span>预估等级
												<el-select v-model="selectedLevel" placeholder="—全部—" clearable
                                   style="width: 110px;">
													<el-option v-for="aqi in aqiLevelList" :key="aqi.level"
                                     :label="aqi.name" :value="aqi.number"/>
												</el-select>
											</span>
                  </el-col>
                  <el-col :span="5">
											<span>反馈日期
												<el-date-picker v-model="selectedDateSupervisor" type="date"
                                        placeholder="反馈日期" style="width: 120px;"/>
											</span>
                  </el-col>
                  <el-col :span="3">
                    <el-button type="primary" color="red" @click="handleReset()">清空</el-button>
                    <el-button type="primary" color="blue"
                               @click="handleSearch()">查询
                    </el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-radio-group v-model="radio" class="ml-4">
                      <el-radio :value="1" size="large">未指派</el-radio>
                      <el-radio :value="2" size="large">已指派</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
              </div>
              <!-- status = 1 列表 -->
              <template v-if="currentTable === 'table1'">
                <div>
                  <el-table :data="currentInfoList1">
                    <el-table-column prop="num" label="编号" width="100"></el-table-column>
                    <el-table-column prop="supervisorName" label="反馈者姓名"
                                     width="120"></el-table-column>
                    <el-table-column prop="province.provinceName" label="所在省"
                                     width="200"></el-table-column>
                    <el-table-column prop="city.cityName" label="所在市" width="100"></el-table-column>
                    <el-table-column prop="aqiInfo" label="预估污染等级" width="130"></el-table-column>
                    <el-table-column prop="date" label="反馈日期" width="180"></el-table-column>
                    <el-table-column prop="time" label="反馈时间" width="180"></el-table-column>
                    <el-table-column label="操作" width="180">
                      <template v-slot="scope">
                        <el-button type="primary" circle @click="showInfo1(scope.row)">
                          <el-icon>
                            <InfoFilled/>
                          </el-icon>
                        </el-button>
                        <el-button type="danger" circle @click="showPointer(scope.row)">
                          <el-icon>
                            <Pointer/>
                          </el-icon>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div>
                  <el-pagination v-model="infoCurrentPageNum1" :current-page="infoCurrentPageNum1"
                                 :small="small" :disabled="disabled" :background="background"
                                 layout="prev, pager, next, jumper" :page-count="infoPageNum1"
                                 @current-change="handleInfoPageChange1" v-if="infoPageNum1>=2 "/>
                </div>
              </template>


              <!-- status = 2 列表 -->
              <template v-if="currentTable === 'table2'">
                <el-table :data="currentInfoList2">
                  <el-table-column prop="num" label="编号" width="100"></el-table-column>
                  <el-table-column prop="supervisorName" label="反馈者姓名" width="180"></el-table-column>
                  <el-table-column prop="inspectorName" label="网格员姓名" width="180"></el-table-column>
                  <el-table-column prop="province.provinceName" label="所在省"
                                   width="100"></el-table-column>
                  <el-table-column prop="city.cityName" label="所在市" width="100"></el-table-column>
                  <el-table-column prop="aqiInfo" label="预估污染等级" width="130"></el-table-column>
                  <el-table-column prop="date" label="反馈日期" width="180"></el-table-column>
                  <el-table-column prop="time" label="反馈时间" width="180"></el-table-column>
                  <el-table-column label="操作" width="180">
                    <template v-slot="scope">
                      <el-button type="primary" circle @click="showInfo2(scope.row)">
                        <el-icon>
                          <InfoFilled/>
                        </el-icon>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- status = 2信息列表页码 -->
                <el-pagination v-model="infoCurrentPageNum2" :current-page="infoCurrentPageNum2"
                               v-if="infoPageNum2>=2 " :small="small" :disabled="disabled" :background="background"
                               layout="prev, pager, next, jumper" :page-count="infoPageNum2"
                               @current-change="handleInfoPageChange2"/>
              </template>

              <div v-if="currentTable === 'table3'" style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px ">
                <el-row :gutter="20" style="color: gray;">
                  <el-col :span="4">
											<span>省区域
												<el-select v-model="selectedProvince1" placeholder="—全部—"
                                   @change="handleProvinceChange1" style="width: 130px;">
													<el-option v-for="province in provinces1" :key="province.provinceId"
                                     :label="province.provinceName" :value="province.provinceId"/>
												</el-select>
											</span>
                  </el-col>
                  <el-col :span="4">
											<span>市区域
												<el-select v-model="selectedCity1" :disabled="!selectedProvince1"
                                   placeholder="—全部—" style="width: 120px;">
													<el-option v-for="city in cities1" :key="city.cityCode"
                                     :label="city.cityName" :value="city.cityCode"/>
												</el-select>
											</span>
                  </el-col>
                  <el-col :span="4">
											<span>预估等级
												<el-select v-model="selectedLevel1" placeholder="—全部—" clearable
                                   style="width: 110px;">
													<el-option v-for="aqi in aqiLevelList" :key="aqi.level"
                                     :label="aqi.name" :value="aqi.number"/>
												</el-select>
											</span>
                  </el-col>
                  <el-col :span="5">
											<span>确认日期
												<el-date-picker v-model="selectedDateInspector" type="date"
                                        placeholder="确认日期" style="width: 120px;"/>
											</span>
                  </el-col>
                  <el-col :span="3">
                    <el-button type="primary" color="red" @click="handleReset1()">清空</el-button>
                    <el-button type="primary" color="blue"
                               @click="handleSearch1()">查询
                    </el-button>
                  </el-col>
                </el-row>
              </div>

              <!-- status = 3 列表-->
              <template v-if="currentTable === 'table3'">
                <el-table :data="currentInfoList3">
                  <el-table-column prop="num" label="编号" width="80"></el-table-column>
                  <el-table-column prop="province.provinceName" label="所在省"
                                   width="100"></el-table-column>
                  <el-table-column prop="city.cityName" label="所在市" width="100"></el-table-column>
                  <el-table-column prop="aqiInfo" label="AQI等级" width="120"></el-table-column>
                  <el-table-column prop="dateSupervisor" label="反馈日期" width="150"></el-table-column>
                  <el-table-column prop="timeSupervisor" label="反馈时间" width="120"></el-table-column>
                  <el-table-column prop="dateInspector" label="确认日期" width="150"></el-table-column>
                  <el-table-column prop="timeInspector" label="确认时间" width="120"></el-table-column>
                  <el-table-column prop="inspectorName" label="网格员" width="100"></el-table-column>
                  <el-table-column prop="supervisorName" label="反馈者" width="100"></el-table-column>

                  <el-table-column label="操作" width="100">
                    <template v-slot="scope">
                      <el-button type="primary" circle @click="showInfo3(scope.row)">
                        <el-icon>
                          <InfoFilled/>
                        </el-icon>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- status = 3信息列表页码 -->
                <el-pagination v-model="infoCurrentPageNum3" :current-page="infoCurrentPageNum3"
                               v-if="infoPageNum3>=2" :small="small" :disabled="disabled" :background="background"
                               layout="prev, pager, next, jumper" :page-count="infoPageNum3"
                               @current-change="handleInfoPageChange3"/>
              </template>


              <!-- 详细信息1 -->
              <template v-if="currentTable === 'table11' ||currentTable === 'table12'">
                <el-descriptions style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px"
                                 class="margin-top" title="公众监督信息详情" :column="1" border>
                  <template #extra>
                    <el-button style="margin-top: 10px;margin-bottom: 10px;margin-right: 20px"
                               type="primary" color="#98c8f2" @click="infoBack1">返回
                    </el-button>
                  </template>
                  <el-descriptions-item label="公众监督反馈信息编号">
                    {{ infoDetail1.id }}
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈者信息">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail1.userInfo.name }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail1.userInfo.sex }}
                    </el-tag>
                    <el-tag size="small">{{ infoDetail1.userInfo.birthday }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈者联系电话">
                    {{ infoDetail1.userInfo.phoneNum }}
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈信息所在地址">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail1.location.province }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail1.location.city }}
                    </el-tag>
                    <el-tag size="small">{{ infoDetail1.address }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈信息表述">
                    {{ infoDetail1.feedback }}
                  </el-descriptions-item>
                  <el-descriptions-item label="预估等级">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail1.currentAQIDetail.level }}
                    </el-tag>
                    <el-tag size="small">{{ infoDetail1.currentAQIDetail.name }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈日期时间">
                    <el-tag size="small" style="margin-right: 8px;">{{ infoDetail1.date }}</el-tag>
                    <el-tag size="small">{{ infoDetail1.time }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
                <el-row :gutter="20"
                        style="color: gray;margin-top: 10px;margin-bottom: 10px;margin-left: 10px">
                  <el-col :span="4">
										<span>是否异地指派
											<el-switch v-model="yidizhipai" class="ml-2"
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"/></span>
                  </el-col>
                  <el-col :span="4">
										<span>省区域
											<el-select v-model="selectedProvince0" placeholder="—全部—"
                                 @change="handleProvinceChange0" style="width: 130px;"
                                 :disabled="isProvinceDisabled0">
												<el-option v-for="province in provinces0" :key="province.provinceId"
                                   :label="province.provinceName" :value="province.provinceId"/>
											</el-select>
										</span>
                  </el-col>
                  <el-col :span="4">
										<span>市区域
											<el-select v-model="selectedCity0" :disabled="isCityDisabled0"
                                 placeholder="—全部—" style="width: 120px;">
												<el-option v-for="city in cities0" :key="city.cityCode"
                                   :label="city.cityName" :value="city.cityCode"/>
											</el-select>
										</span>
                  </el-col>
                  <el-col :span="4">
										<span>指派给
											<el-select v-model="selectedInspector" placeholder="—全部—"
                                 style="width: 120px;">
												<el-option v-for="inspector in inspectors"
                                   :key="inspector.inspectorId" :label="inspector.realName"
                                   :value="inspector.inspectorId"/>
											</el-select>
										</span>
                    <el-col :span="4">
                      <el-button type="primary" plain @click="assign(infoDetail1.id)">指派</el-button>
                    </el-col>
                  </el-col>
                </el-row>
              </template>


              <template v-if="currentTable === 'table21'">
                <el-descriptions style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px"
                                 class="margin-top" title="公众监督信息详情" :column="1" :size="size" border>
                  <template style="margin-top: 10px;margin-bottom: 10px;margin-right: 10px" #extra>
                    <el-button type="primary" color="#98c8f2" @click="infoBack2">返回</el-button>
                  </template>
                  <el-descriptions-item label="公众监督反馈信息编号">
                    {{ infoDetail2.id }}
                  </el-descriptions-item>
                  <el-descriptions-item label="公共监督员信息">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail2.supervisor.name }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail2.supervisor.phoneNum }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="网格员信息">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail2.inspector.name }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail2.inspector.phoneNum }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈信息所在地址">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail2.location.province }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail2.location.city }}
                    </el-tag>
                    <el-tag size="small">{{ infoDetail2.address }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈信息表述">
                    {{ infoDetail2.feedback }}
                  </el-descriptions-item>
                  <el-descriptions-item label="预估等级">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail2.currentAQIDetail.level }}
                    </el-tag>
                    <el-tag size="small">{{ infoDetail2.currentAQIDetail.name }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈日期时间">
                    <el-tag size="small" style="margin-right: 8px;">{{ infoDetail2.date }}</el-tag>
                    <el-tag size="small">{{ infoDetail2.time }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </template>

              <template v-if="currentTable === 'table31'">
                <el-descriptions style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px"
                                 class="margin-top" title="确认数据详情" :column="1" :size="size" border>
                  <template style="margin-top: 10px;margin-bottom: 10px;margin-right: 10px" #extra>
                    <el-button type="primary" color="#98c8f2" @click="infoBack3">返回</el-button>
                  </template>
                  <el-descriptions-item label="确认信息数据编号">
                    {{ infoDetail3.id }}
                  </el-descriptions-item>
                  <el-descriptions-item label="确认信息所在地址">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail3.location.province }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail3.location.city }}
                    </el-tag>
                    <el-tag size="small">{{ infoDetail3.address }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="确认AQI等级">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail3.currentAQIDetail.level }}
                    </el-tag>
                    <el-tag size="small">{{ infoDetail3.currentAQIDetail.name }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="公共监督员信息">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail3.supervisor.name }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail3.supervisor.phoneNum }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="网格员信息">
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail3.inspector.name }}
                    </el-tag>
                    <el-tag size="small"
                            style="margin-right: 8px;">{{ infoDetail3.inspector.phoneNum }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="公共监督员反馈信息描述">
                    {{ infoDetail3.feedback }}
                  </el-descriptions-item>
                  <el-descriptions-item label="污染详情">
                    <el-tag size="small" style="margin-right: 8px;">{{ infoDetail3.so2 }}</el-tag>
                    <el-tag size="small" style="margin-right: 8px;">{{ infoDetail3.co }}</el-tag>
                    <el-tag size="small" style="margin-right: 8px;">{{ infoDetail3.o3 }}</el-tag>
                    <el-tag size="small">{{ infoDetail3.pm25 }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="反馈日期时间">
                    <el-tag size="small" style="margin-right: 8px;">{{ infoDetail3.dateSupervisor }}</el-tag>
                    <el-tag size="small">{{ infoDetail3.timeSupervisor }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="确认日期时间">
                    <el-tag size="small" style="margin-right: 8px;">{{ infoDetail3.dateInspector }}</el-tag>
                    <el-tag size="small">{{ infoDetail3.timeInspector }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </template>

            </el-scrollbar>
          </el-main>

        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  ref,
  watch,
  onMounted,
} from 'vue';
import {
  useRouter
} from 'vue-router';
import {
  Menu as IconMenu,
  Message,
  Setting,
  IconNote
} from '@element-plus/icons-vue';
import {ElMessage} from 'element-plus'
import {
  useAdminStore,
} from '@/stores/adminStore.js';
import {
  useAQIStore,
} from '@/stores/aqiLevelStore.js';

import {
  useLocationStore,
} from '@/stores/locationStore.js';
import {ElMessageBox} from "element-plus/lib/components";

export default {
  name: 'AdminBoard',
  components: {
    IconMenu,
    Message,
    Setting,
  },
  setup() {
    const router = useRouter();
    const mainTitle = ref('');
    const subTitle = ref('');
    const formattedTitle = ref(`点击左侧导航栏查看信息`);
    const adminStore = useAdminStore();
    const aqiStore = useAQIStore();
    const locationStore = useLocationStore();
    const infoPageSize = ref(10);
    const small = ref(false);
    const background = ref(true);
    const disabled = ref(false);
    const aqiLevelList = ref([]);
    let yidizhipai = ref(true);
    let selectedInspector = ref(null);
    let selectedProvince = ref(null);
    let selectedCity = ref(null);
    let selectedCity0 = ref(null);
    let selectedCity1 = ref(null);
    let selectedProvince1 = ref(null);
    let selectedProvince0 = ref(null);
    let selectedLevel = ref(null);
    let selectedLevel1 = ref(null);
    let selectedDateSupervisor = ref(null);
    let selectedDateInspector = ref(null);
    let provinces = ref([]);
    let cities = ref([]);
    let provinces1 = ref([]);
    let cities1 = ref([]);
    let provinces0 = ref([]);
    let cities0 = ref([]);
    let inspectors = ref([]);
    let radio = ref('1');
    let isProvinceDisabled0 = ref(false);
    let isCityDisabled0 = ref(true);
    let currentTable = ref({});
    let currentInfoList1 = ref([]);
    let currentInfoList2 = ref([]);
    let currentInfoList3 = ref([]);
    let infoPageNum1 = ref(0);
    let infoCurrentPageNum1 = ref(1);
    let infoPageNum2 = ref(0);
    let infoCurrentPageNum2 = ref(1);
    let infoPageNum3 = ref(0);
    let infoCurrentPageNum3 = ref(1);
    let infoNum1 = ref(0);
    let infoNum2 = ref(0);
    let infoNum3 = ref(0);

    let infoDetail1 = ref({
      id: "38",
      cityCode: "",
      userInfo: {
        name: "欧阳锋",
        sex: "男",
        birthday: "1980-11-13",
        phoneNum: "17345988896",
      },
      location: {
        province: "辽宁省",
        city: "大连市",
      },
      address: "甘井子区凌风街乘风社区",
      feedback: "月黑风高，空气浑浊，难道是杀人夜？",
      currentAQIDetail: {
        level: "四级",
        name: "中度污染",
      },
      date: "2022-10-27",
      time: "16:29:26",

    });

    let infoDetail2 = ref({
      id: "38",
      supervisor: {
        name: "欧阳锋",
        phoneNum: "17345988896",
      },
      inspector: {
        name: "欧阳锋",
        phoneNum: "17345988896",
      },
      location: {
        province: "辽宁省",
        city: "大连市",
      },
      address: "甘井子区凌风街乘风社区",
      feedback: "月黑风高，空气浑浊，难道是杀人夜？",
      currentAQIDetail: {
        level: "四级",
        name: "中度污染",
      },
      so2: "666",
      co: "666",
      o3: "6666",
      pm25: "6666",
      date: "2022-10-27",
      time: "16:29:26",
    });

    let infoDetail3 = ref({
      id: "38",
      supervisor: {
        name: "欧阳锋",
        phoneNum: "17345988896",
      },
      inspector: {
        name: "欧阳锋",
        phoneNum: "17345988896",
      },
      location: {
        province: "辽宁省",
        city: "大连市",
      },
      address: "甘井子区凌风街乘风社区",
      feedback: "月黑风高，空气浑浊，难道是杀人夜？",
      currentAQIDetail: {
        level: "四级",
        name: "中度污染",
      },
      dateSupervisor: "2022-10-27",
      timeSupervisor: "16:29:26",
      dateInspector: "2022-10-27",
      timeInspector: "16:29:26",
      so2: "666",
      co: "666",
      o3: "6666",
      pm25: "6666",
    });

    const getSelectedInspectorName = () => {
      const selected = inspectors.value.find(inspector => inspector.inspectorId === selectedInspector.value);
      return selected ? selected.realName : '';
    }

    const assign = async (infoId) => {
      // console.log(selectedInspector.value);
      // console.log(infoId);
      // console.log("city:",selectedCity0.value);
      // console.log("province:",selectedProvince0.value);
      // console.log(selectedCity0.value);

      ElMessageBox.confirm(
          '您将指派网格员“'+getSelectedInspectorName()+'”'+"负责本信息，确定吗？",
          '确认指派',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(async () => {
            ElMessage({
              type: 'success',
              message: '指派成功',
            })
            const data = await adminStore.getInfoById(infoId);
            showInfo2(data);

            // await adminStore.setInfoToInspector(infoId,selectedInspector.value);
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消指派',
            })
          })

    }

    const handleSearch = async () => {
      // console.log("handleSearch");
      if (selectedDateSupervisor.value === null) {
        var handledDate1 = null;
      } else {
        var date1 = new Date(selectedDateSupervisor.value);
        var handledDate1 =
            `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
      }

      var cityCodeList = [];
      if (selectedProvince.value != null) {
        // console.log(selectedProvince.value);s
        if (selectedCity.value === null) {
          // console.log(selectedCity.value);
          cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince.value);
          // console.log(cityCodeList);
        } else {
          cityCodeList = [];
          // console.log(selectedCity.value);
          cityCodeList.push(selectedCity.value);
        }
      }
      // console.log(selectedProvince.value);
      // console.log(cityCodeList);
      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: radio.value,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: handledDate1,
        pageNum: 1,
        pageSize: infoPageSize.value,
      });
      var infoNum = await adminStore.getInfoCount({
        aqiLevel: selectedLevel.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: radio.value,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: handledDate1,
      });
      if (radio.value == 1) {
        infoNum1.value = infoNum;
        infoPageNum1.value = Math.ceil(infoNum1.value / infoPageSize.value);
        infoCurrentPageNum1.value = 1;
        showInfoList1();
        ElMessage({
          message: '查询成功',
          type: 'success',
        })

        // console.log("showInfoList1");
      } else if (radio.value == 2) {
        infoNum2.value = infoNum;
        infoPageNum2.value = Math.ceil(infoNum2.value / infoPageSize.value);
        infoCurrentPageNum2.value = 1;
        // console.log("showInfoList2");
        showInfoList2();
        ElMessage({
          message: '查询成功',
          type: 'success',
        })
      } else {
        ElMessage.error('查询失败。');
        console.error("radio.value error");
      }
      // 	console.log(handledDate1);
      // 	const date2 = new Date()selectedDateInspector.value;
      console.log("selectedProvince:", selectedProvince.value,
          "selectedCity:", selectedCity.value, "selectedLevel:", selectedLevel.value, "radio:", radio
              .value,
          "selectedDateSupervisor:", selectedDateSupervisor.value, "selectedDateInspector:",
          selectedDateInspector.value);
    };

    const handleSearch1 = async () => {
      if (selectedDateInspector.value === null) {
        var handledDate2 = null;
      } else {
        var date2 = new Date(selectedDateInspector.value);
        var handledDate2 =
            `${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}-${String(date2.getDate()).padStart(2, '0')}`;
      }

      var cityCodeList = [];
      if (selectedProvince1.value != null) {
        if (selectedCity1.value === null) {
          cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince1.value);
        } else {
          cityCodeList.push(selectedCity1.value);
        }
      }
      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel1.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: 3,
        supervisorName: null,
        timeInspector: handledDate2,
        timeSupervisor: null,
        pageNum: 1,
        pageSize: infoPageSize.value,
      });
      var infoNum = await adminStore.getInfoCount({
        aqiLevel: selectedLevel1.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: 3,
        supervisorName: null,
        timeInspector: handledDate2,
        timeSupervisor: null,
      });
      infoNum3.value = infoNum;
      infoPageNum3.value = Math.ceil(infoNum3.value / infoPageSize.value);
      infoCurrentPageNum3.value = 1;
      showInfoList3();
      ElMessage({
        message: '查询成功',
        type: 'success',
      })

      // console.log("selectedProvince:", selectedProvince.value,
      //     "selectedCity:", selectedCity.value, "selectedLevel:", selectedLevel.value, "radio:", radio
      //         .value,
      //     "selectedDateSupervisor:", selectedDateSupervisor.value, "selectedDateInspector:",
      //     selectedDateInspector.value);
    };


    const handleReset = async () => {
      await initSelectedData();
    };

    const handleReset1 = async () => {
      await initSelectedData();
    };

    onMounted(async () => {
      aqiLevelList.value = aqiStore.getAllAQILevels();
      await loadProvinces();
    });

    // 加载省份数据
    const loadProvinces = async () => {
      await locationStore.initLocationStore();
      provinces.value = locationStore.provinces;
      provinces1.value = locationStore.provinces;
      provinces0.value = locationStore.provinces;
      // console.log(provinces.value);
    };


    const handleProvinceChange0 = async (provinceId) => {
      cities0.value = await locationStore.getCitiesByProvinceId(provinceId);
      // console.log(cities0.value);
      var cityCodeList = [];
      if (selectedProvince0.value != null) {
        if (selectedCity0.value === null) {
          cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince0.value);
        } else {
          cityCodeList = [];
          cityCodeList.push(selectedCity0.value);
        }
      }
      inspectors.value = await adminStore.getInspectorsByCityCodeList(cityCodeList);
      if(!isProvinceDisabled0.value){
        isCityDisabled0.value = false;
        selectedCity0.value = null; // 重置城市选择

      }
    };
    // 当省份改变时更新城市数据
    const handleProvinceChange = async (provinceId) => {
      cities.value = await locationStore.getCitiesByProvinceId(provinceId);
      selectedCity.value = null; // 重置城市选择
    };

    const handleProvinceChange1 = async (provinceId) => {
      cities1.value = await locationStore.getCitiesByProvinceId(provinceId);
      selectedCity1.value = null; // 重置城市选择
    };

    const handleSelect = async () => {

    };
    watch(yidizhipai, async (newValue, oldValue) => {
      // console.log(cities0.value);
      // console.log(provinces0.value);
      if (newValue) {
        selectedCity0.value = null;
        selectedProvince0.value = null;
        isCityDisabled0.value = true;
        isProvinceDisabled0.value = false;
        inspectors.value = await  adminStore.getInspectors();
        selectedInspector.value = null;
      } else {
        isCityDisabled0.value = true;
        isProvinceDisabled0.value = true;
        const cityProvince = await locationStore.getCityAndProvinceByCityCode(infoDetail1.value.cityCode);
        selectedProvince0.value = cityProvince.provinceId;
        cities0.value = await locationStore.getCitiesByProvinceId(selectedProvince0.value);
        selectedCity0.value = cityProvince.cityCode;
        var cityCodeList = [];
        if (selectedProvince0.value != null) {
          if (selectedCity0.value === null) {
            cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince0.value);
          } else {
            cityCodeList = [];
            cityCodeList.push(selectedCity0.value);
          }
        }
        // console.log("yidizhipai",cityCodeList);
        inspectors.value = await adminStore.getInspectorsByCityCodeList(cityCodeList);
        console.log(inspectors.value);
        // console.log(cities0.value);
        // console.log(selectedCity0.value);
        // console.log(selectedProvince0.value);
      }
      console.log(selectedCity0.value);
      console.log(`yidizhipai值从${oldValue}变更为${newValue}`);
    });


    watch(radio, (newValue, oldValue) => {
      if (newValue == 1) {
        initTable1();
      } else if (newValue == 2) {
        initTable2();
      }
      console.log(`radio值从${oldValue}变更为${newValue}`);
    });

    // 观察省份选择的变化
    watch(selectedProvince, (newValue) => {
      if (newValue) {
        handleProvinceChange(newValue);
      } else {
        cities.value = [];
      }
    });
    watch(selectedProvince0, (newValue) => {
      if (newValue) {
        handleProvinceChange0(newValue);
      } else {
        cities0.value = [];
      }
    });
    watch(selectedCity0, async(newValue) => {
      if (newValue) {
        console.log(selectedCity0.value);
        inspectors.value = await adminStore.getInspectorsByCityCodeList([selectedCity0.value]);
      } else {
        cities0.value = [];
      }
    });
    watch(selectedProvince1, (newValue) => {
      if (newValue) {
        handleProvinceChange1(newValue);
      } else {
        cities1.value = [];
      }
    });

    watch([mainTitle, subTitle], ([newMainTitle, newSubTitle]) => {
      formattedTitle.value = `${newMainTitle} / ${newSubTitle}`;
    });

    //更新导航位置
    const updateLocation = (newMainTitle, newSubTitle) => {
      mainTitle.value = newMainTitle;
      subTitle.value = newSubTitle;
    };

    const initSelectedData = async () => {
      selectedProvince.value = null;
      selectedCity.value = null;
      selectedLevel.value = null;
      selectedDateSupervisor.value = null;
    };

    const initSelectedData1 = async () => {
      selectedProvince1.value = null;
      selectedCity1.value = null;
      selectedLevel1.value = null;
      selectedDateInspector.value = null;
    };

    //初始化table1
    const initTable1 = async () => {
      infoCurrentPageNum1.value = 1;
      console.log("radio", radio.value);
      radio.value = 1;
      console.log("initTable1");
      await initSelectedData();
      updateLocation('公众监督数据管理', '公众监督数据列表');
      currentTable.value = 'table1';
      infoNum1.value = await adminStore.getInfoCount({
        status: 1,
      });
      console.log(infoNum1.value);
      infoPageNum1.value = Math.ceil(infoNum1.value / infoPageSize.value);
      await adminStore.fetchInfoList({
        aqiLevel: null,
        cityCode: null,
        inspectorName: null,
        pageNum: 1,
        pageSize: infoPageSize.value,
        status: 1,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: null,
      });
      showInfoList1();
    };


    //初始化table2
    const initTable2 = async () => {
      infoCurrentPageNum2.value = 1;
      console.log("initTable2");
      await initSelectedData();
      updateLocation('公众监督数据管理', '公众监督数据列表');
      currentTable.value = 'table2';
      infoNum2.value = await adminStore.getInfoCount({
        status: 2,
      });
      infoPageNum2.value = Math.ceil(infoNum2.value / infoPageSize.value);
      await adminStore.fetchInfoList({
        aqiLevel: null,
        cityCode: null,
        inspectorName: null,
        pageNum: 1,
        pageSize: infoPageSize.value,
        status: 2,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: null,
      });
      showInfoList2();
    };

    //初始化table3
    const initTable3 = async () => {
      infoCurrentPageNum3.value = 1;
      console.log("initTable3");
      await initSelectedData1();
      updateLocation('确认AQI数据管理', '确认AQI数据列表');
      currentTable.value = 'table3';
      infoNum3.value = await adminStore.getInfoCount({
        status: 3,
      });
      infoPageNum3.value = Math.ceil(infoNum3.value / infoPageSize.value);
      await adminStore.fetchInfoList({
        aqiLevel: null,
        cityCode: null,
        inspectorName: null,
        pageNum: 1,
        pageSize: infoPageSize.value,
        status: 3,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: null,
      });
      showInfoList3();

    };

    //table1页数变化
    const handleInfoPageChange1 = async (page) => {
      console.log(handleInfoPageChange1);
      if (selectedDateSupervisor.value === null) {
        var handledDate1 = null;
      } else {
        var date1 = new Date(selectedDateSupervisor.value);
        var handledDate1 =
            `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
      }

      var cityCodeList = [];
      if (selectedProvince.value != null) {
        if (selectedCity.value === null) {
          cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince.value);
        } else {
          cityCodeList = [];

          cityCodeList.push(selectedCity.value);
        }
      }
      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: 1,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: handledDate1,
        pageNum: infoCurrentPageNum1.value,
        pageSize: infoPageSize.value,
      });
      infoCurrentPageNum1.value = page;
      showInfoList1();
    };

    //table2页数变化
    const handleInfoPageChange2 = async (page) => {
      // console.log(infoPageNum.value);
      infoCurrentPageNum2.value = page;
      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel.value,
        cityCode: null,
        inspectorName: null,
        pageNum: infoCurrentPageNum2.value,
        pageSize: infoPageSize.value,
        status: 2,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: null,
      });

      showInfoList2();
    };

    //table3页数变化
    const handleInfoPageChange3 = async (page) => {
      // console.log(infoPageNum.value);
      infoCurrentPageNum3.value = page;
      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel.value,
        cityCode: null,
        inspectorName: null,
        pageNum: infoCurrentPageNum3.value,
        pageSize: infoPageSize.value,
        status: 3,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: null,
      });

      showInfoList3();
    };

    //从Stores进行数据展示InfoList1
    const showInfoList1 = async () => {
      console.log("showInfoList1");
      let date = new Date();
      currentInfoList1.value = [];
      for (let i = 0; i < adminStore.infoList1.length; i++) {
        let info = {
          num: 'null',
          id: 'null',
          supervisorName: 'null',
          cityCode: 'null',
          aqiLevel: 'null',
          label: 'null',
          date: 'null',
          time: 'null',
        };

        info.num = (infoCurrentPageNum1.value - 1) * infoPageSize.value + i + 1;
        // console.log(info.num);
        info.id = adminStore.infoList1[i].infoId;
        info.supervisorName = adminStore.infoList1[i].supervisorName;
        info.province = await locationStore.getProvinceByCityCode(adminStore.infoList1[i].cityCode);
        info.city = await locationStore.getCityAndProvinceByCityCode(adminStore.infoList1[i].cityCode);
        const aqiInfo = aqiStore.getAQIDetail(adminStore.infoList1[i].aqiLevel);
        info.aqiInfo = aqiInfo.name + "(" + aqiInfo.level + ")";

        info.label = adminStore.infoList1[i].label;
        date = new Date(adminStore.infoList1[i].timeSupervisor);
        info.date =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        info.time =
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        currentInfoList1.value.push(info);
        // console.log(currentInfoList1.value[i]);
        // console.log(i);
      }

      // console.log(adminStore.infoList1);
    };


    //从Stores进行数据展示InfoList2
    const showInfoList2 = async () => {
      console.log("showInfoList2");
      let date = new Date();
      currentInfoList2.value = [];
      for (let i = 0; i < adminStore.infoList2.length; i++) {
        let info = {
          num: 'null',
          id: 'null',
          supervisorName: 'null',
          inspectorName: 'null',
          cityCode: 'null',
          aqiLevel: 'null',
          label: 'null',
          time: 'null',
          date: 'null',
        };
        info.num = (infoCurrentPageNum2.value - 1) * infoPageSize.value + i + 1;
        info.id = adminStore.infoList2[i].infoId;
        info.supervisorName = adminStore.infoList2[i].supervisorName;
        info.inspectorName = adminStore.infoList2[i].inspectorName;
        info.province = await locationStore.getProvinceByCityCode(adminStore.infoList2[i].cityCode);
        info.city = await locationStore.getCityAndProvinceByCityCode(adminStore.infoList2[i].cityCode);
        const aqiInfo = aqiStore.getAQIDetail(adminStore.infoList2[i].aqiLevel);
        info.aqiInfo = aqiInfo.name + "(" + aqiInfo.level + ")";
        info.label = adminStore.infoList2[i].label;

        date = new Date(adminStore.infoList2[i].timeSupervisor);
        info.date =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        info.time =
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        currentInfoList2.value.push(info);
        // console.log(currentInfoList2.value[i]);
        // console.log(i);
      }

      // console.log(adminStore.infoList2);
    };


    //从Stores进行数据展示InfoList3
    const showInfoList3 = async () => {
      console.log("showInfoList3");
      let date1 = new Date();
      let date2 = new Date();
      currentInfoList3.value = [];
      for (let i = 0; i < adminStore.infoList3.length; i++) {
        let info = {
          num: 'null',
          id: 'null',
          supervisorName: 'null',
          inspectorName: 'null',
          cityCode: 'null',
          aqiInfo: 'null',
          label: 'null',
          dateInspector: 'null',
          timeInspector: 'null',
          timeSupervisor: 'null',
          dateSupervisor: 'null',
        };

        info.num = (infoCurrentPageNum3.value - 1) * infoPageSize.value + i + 1;
        info.id = adminStore.infoList3[i].infoId;
        info.inspectorName = adminStore.infoList3[i].inspectorName;
        info.supervisorName = adminStore.infoList3[i].supervisorName;
        info.province = await locationStore.getProvinceByCityCode(adminStore.infoList3[i].cityCode);

        info.city = await locationStore.getCityAndProvinceByCityCode(adminStore.infoList3[i].cityCode);

        const aqiInfo = aqiStore.getAQIDetail(adminStore.infoList3[i].aqiLevel);
        info.aqiInfo = aqiInfo.name + "(" + aqiInfo.level + ")";

        info.label = adminStore.infoList3[i].label;

        date1 = new Date(adminStore.infoList3[i].timeSupervisor);
        info.dateSupervisor =
            `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
        info.timeSupervisor =
            `${String(date1.getHours()).padStart(2, '0')}:${String(date1.getMinutes()).padStart(2, '0')}:${String(date1.getSeconds()).padStart(2, '0')}`;
        date2 = new Date(adminStore.infoList3[i].timeInspector);
        info.dateInspector =
            `${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}-${String(date2.getDate()).padStart(2, '0')}`;
        info.timeInspector =
            `${String(date2.getHours()).padStart(2, '0')}:${String(date2.getMinutes()).padStart(2, '0')}:${String(date2.getSeconds()).padStart(2, '0')}`;
        // console.log("info"+i+info);
        currentInfoList3.value.push(info);
        // console.log(currentInfoList3.value[i]);
        // console.log(i);
      }

      console.log(currentInfoList3.value);
    };


    //查看table1信息的详细信息
    const showInfo1 = async (data) => {
      updateLocation('公众监督数据管理', '公众监督数据详情');
      currentTable.value = 'table11';
      const info = await adminStore.getInfoById(data.id);
      showInfoDetails1(info);

    };

    //查看table2信息的详细信息
    const showInfo2 = async (data) => {
      updateLocation('公众监督数据管理', '公众监督数据详情');
      currentTable.value = 'table21';
      const info = await adminStore.getInfoById(data.id);
      showInfoDetails2(info);
    };


    //查看table3信息的详细信息
    const showInfo3 = async (data) => {
      updateLocation('确认AQI数据管理', '确认AQI数据详情');
      currentTable.value = 'table31';
      const info = await adminStore.getInfoById(data.id);
      showInfoDetails3(info);
    };


    //填充table1信息的细节
    const showInfoDetails1 = async (data) => {
      infoDetail1.value.id = data.infoId;
      infoDetail1.value.cityCode = data.cityCode;
      const supervisor = await adminStore.getSupervisorByInfoId(data.infoId);
      console.log(supervisor);
      infoDetail1.value.userInfo.name = supervisor.realName;
      infoDetail1.value.userInfo.sex = supervisor.sex;
      infoDetail1.value.userInfo.birthday = supervisor.birthday;
      infoDetail1.value.userInfo.phoneNum = supervisor.telId;
      const province = await locationStore.getProvinceByCityCode(data.cityCode);
      const city = await locationStore.getCityAndProvinceByCityCode(data.cityCode);
      infoDetail1.value.location.province = province.provinceName;
      infoDetail1.value.location.city = city.cityName;
      infoDetail1.value.address = data.address;
      infoDetail1.value.feedback = data.feedback;
      const aqiInfo = await aqiStore.getAQIDetail(data.aqiLevel);
      infoDetail1.value.currentAQIDetail.name = aqiInfo.name;
      infoDetail1.value.currentAQIDetail.level = aqiInfo.level;
      const date = new Date(data.timeSupervisor);

      infoDetail1.value.date =
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      infoDetail1.value.time =
          `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    //填充table2信息的细节
    const showInfoDetails2 = async (data) => {
      infoDetail2.value.id = data.infoId;
      const supervisorData = await adminStore.getSupervisorByInfoId(data.infoId);
      const inspectorData = await adminStore.getInspectorByInfoId(data.infoId);
      console.log(supervisorData);
      console.log(inspectorData);
      infoDetail2.value.supervisor.name = supervisorData.realName;
      infoDetail2.value.supervisor.phoneNum = supervisorData.telId;
      infoDetail2.value.inspector.name = inspectorData.realName;
      infoDetail2.value.inspector.phoneNum = inspectorData.telNum;
      console.log("showInfoDetails2",infoDetail2);
      const province = await locationStore.getProvinceByCityCode(data.cityCode);
      const city = await locationStore.getCityAndProvinceByCityCode(data.cityCode);
      infoDetail2.value.location.province = province.provinceName;
      infoDetail2.value.location.city = city.cityName;
      infoDetail2.value.address = data.address;
      infoDetail2.value.feedback = data.feedback;
      infoDetail2.value.so2 = `SO2浓度：${data.so2} ug/m<sup>3</sup>`;
      infoDetail2.value.co = `CO浓度：${data.co} ug/m<sup>3</sup>`;
      infoDetail2.value.o3 = `O3浓度：${data.o3} ug/m<sup>3</sup>`;
      infoDetail2.value.pm25 = `PM2.5浓度：${data.pm25} ug/m<sup>3</sup>`;
      const aqiInfo = await aqiStore.getAQIDetail(data.aqiLevel);
      infoDetail2.value.currentAQIDetail.name = aqiInfo.name;
      infoDetail2.value.currentAQIDetail.level = aqiInfo.level;
      const date = new Date(data.timeSupervisor);
      infoDetail2.value.date =
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      infoDetail2.value.time =
          `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    };

    //填充table3信息的细节
    const showInfoDetails3 = async (data) => {
      infoDetail3.value.id = data.infoId;
      const supervisor = await adminStore.getSupervisorByInfoId(data.infoId);
      const inspector = await adminStore.getInspectorByInfoId(data.infoId);
      infoDetail3.value.supervisor.name = supervisor.realName;
      infoDetail3.value.supervisor.phoneNum = supervisor.telId;
      infoDetail3.value.inspector.name = inspector.realName;
      infoDetail3.value.inspector.phoneNum = inspector.telNum;
      const province = await locationStore.getProvinceByCityCode(data.cityCode);
      const city = await locationStore.getCityAndProvinceByCityCode(data.cityCode);
      infoDetail3.value.location.province = province.provinceName;
      infoDetail3.value.location.city = city.cityName;
      infoDetail3.value.address = data.address;
      infoDetail3.value.feedback = data.feedback;
      const aqiInfo = await aqiStore.getAQIDetail(data.aqiLevel);
      infoDetail3.value.currentAQIDetail.name = aqiInfo.name;
      infoDetail3.value.currentAQIDetail.level = aqiInfo.level;
      infoDetail3.value.so2 = `SO2浓度：${data.so2} ug/m3`;
      infoDetail3.value.co = `CO浓度：${data.co} ug/m3`;
      infoDetail3.value.o3 = `O3浓度：${data.o3} ug/m3`;
      infoDetail3.value.pm25 = `PM2.5浓度：${data.pm25} ug/m3`;
      const date1 = new Date(data.timeSupervisor);
      infoDetail3.value.dateSupervisor =
          `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
      infoDetail3.value.timeSupervisor =
          `${String(date1.getHours()).padStart(2, '0')}:${String(date1.getMinutes()).padStart(2, '0')}:${String(date1.getSeconds()).padStart(2, '0')}`;
      const date2 = new Date(data.timeInspector);
      infoDetail3.value.dateInspector =
          `${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}-${String(date2.getDate()).padStart(2, '0')}`;
      infoDetail3.value.timeInspector =
          `${String(date2.getHours()).padStart(2, '0')}:${String(date2.getMinutes()).padStart(2, '0')}:${String(date2.getSeconds()).padStart(2, '0')}`;
    };


    //查看完信息返回到前一页（1）
    const infoBack1 = async () => {
      updateLocation('公众监督数据管理', '公众监督数据列表');
      currentTable.value = 'table1';

      if (selectedDateSupervisor.value === null) {
        var handledDate1 = null;
      } else {
        var date1 = new Date(selectedDateSupervisor.value);
        var handledDate1 =
            `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
      }

      var cityCodeList = [];
      if (selectedProvince.value != null) {
        if (selectedCity.value === null) {
          cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince.value);
        } else {
          cityCodeList = [];
          cityCodeList.push(selectedCity.value);
        }
      }

      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: 1,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: handledDate1,
        pageNum: infoCurrentPageNum1.value,
        pageSize: infoPageSize.value,
      });
      var infoNum = await adminStore.getInfoCount({
        aqiLevel: selectedLevel.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: radio.value,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: handledDate1,
      });
      infoNum1.value = infoNum;
      infoPageNum1.value = Math.ceil(infoNum1.value / infoPageSize.value);
      showInfoList1();
    };

    //查看完信息返回到前一页（2）
    const infoBack2 = async () => {
      updateLocation('公众监督数据管理', '公众监督数据列表');
      currentTable.value = 'table2';

      if (selectedDateSupervisor.value === null) {
        var handledDate1 = null;
      } else {
        var date1 = new Date(selectedDateSupervisor.value);
        var handledDate1 =
            `${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
      }

      var cityCodeList = [];
      if (selectedProvince.value != null) {
        if (selectedCity.value === null) {
          cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince.value);
        } else {
          cityCodeList = [];
          cityCodeList.push(selectedCity.value);
        }
      }

      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: 2,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: handledDate1,
        pageNum: infoCurrentPageNum2.value,
        pageSize: infoPageSize.value,
      });
      var infoNum = await adminStore.getInfoCount({
        aqiLevel: selectedLevel.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: radio.value,
        supervisorName: null,
        timeInspector: null,
        timeSupervisor: handledDate1,
      });
      infoNum2.value = infoNum;
      infoPageNum2.value = Math.ceil(infoNum2.value / infoPageSize.value);
      showInfoList2();
    };

    //查看完信息返回到前一页（3）
    const infoBack3 = async () => {
      updateLocation('确认AQI数据管理', '确认AQI数据列表');
      currentTable.value = 'table3';
      if (selectedDateInspector.value === null) {
        var handledDate2 = null;
      } else {
        var date2 = new Date(selectedDateInspector.value);
        var handledDate2 =
            `${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}-${String(date2.getDate()).padStart(2, '0')}`;
      }

      var cityCodeList = [];
      if (selectedProvince1.value != null) {
        if (selectedCity1.value === null) {
          cityCodeList = await locationStore.getCitieCodeListByProvinceId(selectedProvince1.value);
        } else {
          cityCodeList.push(selectedCity1.value);
        }
      }

      await adminStore.fetchInfoList({
        aqiLevel: selectedLevel1.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: 3,
        supervisorName: null,
        timeInspector: handledDate2,
        timeSupervisor: null,
        pageNum: infoCurrentPageNum3.value,
        pageSize: infoPageSize.value,
      });
      var infoNum = await adminStore.getInfoCount({
        aqiLevel: selectedLevel1.value,
        cityCode: cityCodeList,
        inspectorName: null,
        status: 3,
        supervisorName: null,
        timeInspector: handledDate2,
        timeSupervisor: null,
      });
      infoNum3.value = infoNum;
      infoPageNum3.value = Math.ceil(infoNum3.value / infoPageSize.value);
      showInfoList3();
    };

    const showPointer = async (data) => {
      // console.log("showPointer:", info);
      updateLocation('公众监督数据管理', '公众监督数据详情');
      currentTable.value = 'table12';
      const info = await adminStore.getInfoById(data.id);
      showInfoDetails1(info);
      // console.log("showPointer:", info);
      inspectors.value = await adminStore.getInspectors();
      console.log(inspectors.value);
    };

    const getProvinceGroupedInspectionStats = () => {
      // currentTable.value = 'table3';
      updateLocation('统计数据管理', '省分组检查统计');
    };

    const getAQIDistributionStats = () => {
      // currentTable.value = 'table4';
      updateLocation('统计数据管理', 'AQI指数分布统计');
    };

    const getAQITrendStats = () => {
      // currentTable.value = 'table5';
      updateLocation('统计数据管理', 'AQI指数趋势统计');
    };

    const getOtherDataStats = () => {
      // currentTable.value = 'table6';
      updateLocation('统计数据管理', '其他数据统计');
    };

    return {
      handleSelect,
      loadProvinces,
      handleProvinceChange1,
      handleProvinceChange0,
      handleProvinceChange,
      formattedTitle,
      updateLocation,
      mainTitle,
      subTitle,
      small,
      background,
      disabled,
      currentTable,
      currentInfoList1,
      currentInfoList2,
      currentInfoList3,
      infoNum1,
      infoPageNum1,
      infoCurrentPageNum1,
      infoNum2,
      infoPageNum2,
      infoCurrentPageNum2,
      infoNum3,
      infoPageNum3,
      infoCurrentPageNum3,
      infoPageSize,
      initTable1,
      initTable2,
      initTable3,
      showInfoList1,
      showInfoList2,
      showInfoList3,
      getProvinceGroupedInspectionStats,
      getAQIDistributionStats,
      getAQITrendStats,
      getOtherDataStats,
      handleInfoPageChange1,
      handleInfoPageChange2,
      handleInfoPageChange3,
      showInfo1,
      showInfo2,
      showInfo3,
      showPointer,
      infoDetail1,
      infoDetail2,
      infoDetail3,
      showInfoDetails1,
      showInfoDetails2,
      showInfoDetails3,
      infoBack1,
      infoBack2,
      infoBack3,
      selectedProvince0,
      selectedProvince,
      selectedProvince1,
      selectedLevel,
      selectedLevel1,
      selectedCity0,
      selectedCity,
      selectedCity1,
      selectedDateInspector,
      selectedDateSupervisor,
      selectedInspector,
      provinces,
      cities,
      provinces1,
      cities1,
      provinces0,
      cities0,
      aqiLevelList,
      radio,
      handleSearch,
      handleSearch1,
      handleReset,
      handleReset1,
      initSelectedData,
      yidizhipai,
      inspectors,
      assign,
      isProvinceDisabled0,
      isCityDisabled0,
      getSelectedInspectorName,
    };
  },
};
</script>

<style scoped>
.layout-container-demo {
  height: 100%;
}

.layout-header {
  position: relative;
  background-color: #409efe;
  color: white;
  text-align: center;
  font-size: 20px;
  line-height: 60px;
}

.layout-container-demo .el-header {
  position: relative;
  background-color: #c1c1c1;
  color: white;
}

.layout-container-demo .el-aside {
  color: white;
  background: #98c8f2;
}

.layout-container-demo .el-menu {
  border-right: none;
  background: #98c8f2;
}

.layout-container-demo .el-menu-item,
.layout-container-demo .el-sub-menu__title {
  color: white;
  background: #98c8f2;
}

.layout-container-demo .el-menu-item:hover,
.layout-container-demo .el-sub-menu__title:hover,
.layout-container-demo .el-menu-item.is-active,
.layout-container-demo .el-sub-menu__title.is-active {
  color: black;
  background: #ecf5ff;
}

.layout-container-demo .el-icon {
  color: white;
}

.layout-container-demo .menu-title {
  color: white;
}

.layout-container-demo .el-main {
  padding: 0;
  flex: 1;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}
</style>