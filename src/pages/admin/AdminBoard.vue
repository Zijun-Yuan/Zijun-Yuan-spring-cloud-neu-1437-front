<template>
	<div class="common-layout">
		<el-container>
			<el-header class="layout-header">东软环保公众监督平台管理系统</el-header>
			<el-container class="layout-container-demo" style="height: 100vh;">
				<el-aside width="300px">
					<el-scrollbar>
						<el-menu :default-openeds="['1', '3']" class="custom-menu" @select="handleSelect">
							<el-sub-menu index="1">
								<template #title>
									<el-icon>
										<Message />
									</el-icon>
									<span class="menu-title">公众监督数据管理</span>
								</template>
								<el-menu-item index="1-1" @click="initTable1">公众监督数据列表</el-menu-item>
								<el-menu-item index="1-2" @click="initTable3">确认AQI数据列表</el-menu-item>
							</el-sub-menu>
							<el-sub-menu index="2">
								<template #title>
									<el-icon>
										<IconMenu />
									</el-icon>
									<span class="menu-title">统计数据管理</span>
								</template>
								<el-menu-item index="2-1"
									@click="getProvinceGroupedInspectionStats">省分组检查统计</el-menu-item>
								<el-menu-item index="2-2" @click="getAQIDistributionStats">AQI指数分布统计</el-menu-item>
								<el-menu-item index="2-3" @click="getAQITrendStats">AQI指数趋势统计</el-menu-item>
								<el-menu-item index="2-4" @click="getOtherDataStats">其他数据统计</el-menu-item>
							</el-sub-menu>
							<el-sub-menu index="3">
								<template #title>
									<el-icon>
										<Setting />
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
						<template>
							<div>
								<el-select v-model="selectedProvince" placeholder="请选择省份"
									@change="handleProvinceChange">
									<el-option v-for="province in provinces" :key="province.provinceId"
										:label="province.provinceName" :value="province.provinceId" />
								</el-select>
								<el-select v-model="selectedCity" :disabled="!selectedProvince" placeholder="请选择城市">
									<el-option v-for="city in cities" :key="city.cityCode" :label="city.cityName"
										:value="city.cityCode" />
								</el-select>
							</div>
						</template>

						<el-scrollbar>
							<!-- status = 1 列表 -->
							<el-table v-if="currentTable === 'table1'" :data="currentInfoList1">
								<el-table-column prop="num" label="编号" width="100"></el-table-column>
								<el-table-column prop="supervisorName" label="反馈者姓名" width="180"></el-table-column>
								<el-table-column prop="province.provinceName" label="所在省" width="100"></el-table-column>
								<el-table-column prop="city.cityName" label="所在市" width="100"></el-table-column>
								<el-table-column prop="aqiInfo" label="预估污染等级" width="130"></el-table-column>
								<el-table-column prop="date" label="反馈日期" width="180"></el-table-column>
								<el-table-column prop="time" label="反馈时间" width="180"></el-table-column>
								<el-table-column label="操作" width="180">
									<template v-slot="scope">
										<el-button type="primary" circle @click="showInfo1(scope.row)">
											<el-icon>
												<InfoFilled />
											</el-icon>
										</el-button>
										<el-button type="danger" circle @click="showPointer(scope.row)">
											<el-icon>
												<Pointer />
											</el-icon>
										</el-button>
									</template>
								</el-table-column>
							</el-table>
							<!-- status = 1信息列表页码 -->
							<el-pagination v-model="infoCurrentPageNum1" :current-page="infoCurrentPageNum1"
								v-if="currentTable === 'table1'" :small="small" :disabled="disabled"
								:background="background" layout="prev, pager, next, jumper" :page-count="infoPageNum1"
								@current-change="handleInfoPageChange1" />

							<!-- status = 2 列表 -->
							<el-table v-if="currentTable === 'table2'" :data="currentInfoList2">
								<el-table-column prop="num" label="编号" width="100"></el-table-column>
								<el-table-column prop="supervisorName" label="反馈者姓名" width="180"></el-table-column>
								<el-table-column prop="inspectorName" label="网格员姓名" width="180"></el-table-column>
								<el-table-column prop="province.provinceName" label="所在省" width="100"></el-table-column>
								<el-table-column prop="city.cityName" label="所在市" width="100"></el-table-column>
								<el-table-column prop="aqiInfo" label="预估污染等级" width="130"></el-table-column>
								<el-table-column prop="date" label="反馈日期" width="180"></el-table-column>
								<el-table-column prop="time" label="反馈时间" width="180"></el-table-column>
								<el-table-column label="操作" width="180">
									<template v-slot="scope">
										<el-button type="primary" circle @click="showInfo2(scope.row)">
											<el-icon>
												<InfoFilled />
											</el-icon>
										</el-button>
									</template>
								</el-table-column>
							</el-table>
							<!-- status = 2信息列表页码 -->
							<el-pagination v-model="infoCurrentPageNum2" :current-page="infoCurrentPageNum2"
								v-if="currentTable === 'table2'" :small="small" :disabled="disabled"
								:background="background" layout="prev, pager, next, jumper" :page-count="infoPageNum2"
								@current-change="handleInfoPageChange2" />


							<!-- status = 3 列表-->
							<el-table v-if="currentTable === 'table3'" :data="currentInfoList3">
								<el-table-column prop="num" label="编号" width="100"></el-table-column>
								<el-table-column prop="province.provinceName" label="所在省" width="100"></el-table-column>
								<el-table-column prop="city.cityName" label="所在市" width="100"></el-table-column>
								<el-table-column prop="aqiInfo" label="AQI等级" width="130"></el-table-column>
								<el-table-column prop="dateSupervisor" label="反馈日期" width="180"></el-table-column>
								<el-table-column prop="timeSupervisor" label="反馈时间" width="180"></el-table-column>
								<el-table-column prop="dateInspector" label="确认日期" width="180"></el-table-column>
								<el-table-column prop="timeInspector" label="确认时间" width="180"></el-table-column>
								<el-table-column prop="inspectorName" label="网格员" width="180"></el-table-column>
								<el-table-column prop="supervisorName" label="反馈者" width="180"></el-table-column>

								<el-table-column label="操作" width="180">
									<template v-slot="scope">
										<el-button type="primary" circle @click="showInfo3(scope.row)">
											<el-icon>
												<InfoFilled />
											</el-icon>
										</el-button>
									</template>
								</el-table-column>
							</el-table>
							<!-- status = 3信息列表页码 -->
							<el-pagination v-model="infoCurrentPageNum3" :current-page="infoCurrentPageNum3"
								v-if="currentTable === 'table3'" :small="small" :disabled="disabled"
								:background="background" layout="prev, pager, next, jumper" :page-count="infoPageNum3"
								@current-change="handleInfoPageChange3" />

							<!-- 详细信息1 -->
							<template v-if="currentTable === 'table11'">
								<el-descriptions class="margin-top" title="公众监督信息详情" :column="1" :size="size" border>
									<template #extra>
										<el-button type="primary" color="#98c8f2" @click="infoBack1">返回</el-button>
									</template>
									<el-descriptions-item label="公众监督反馈信息编号">
										{{ infoDetail1.id }}
									</el-descriptions-item>
									<el-descriptions-item label="反馈者信息">
										<el-tag size="small"
											style="margin-right: 8px;">{{ infoDetail1.userInfo.name }}</el-tag>
										<el-tag size="small"
											style="margin-right: 8px;">{{ infoDetail1.userInfo.sex }}</el-tag>
										<el-tag size="small">{{ infoDetail1.userInfo.birthday }}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item label="反馈者联系电话">
										{{ infoDetail1.userInfo.phoneNum }}
									</el-descriptions-item>
									<el-descriptions-item label="反馈信息所在地址">
										<el-tag size="small"
											style="margin-right: 8px;">{{ infoDetail1.location.province }}</el-tag>
										<el-tag size="small"
											style="margin-right: 8px;">{{ infoDetail1.location.city }}</el-tag>
										<el-tag size="small">{{ infoDetail1.address }}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item label="反馈信息表述">
										{{ infoDetail1.feedback }}
									</el-descriptions-item>
									<el-descriptions-item label="预估等级">
										<el-tag size="small"
											style="margin-right: 8px;">{{ infoDetail1.currentAQLDetail.level }}</el-tag>
										<el-tag size="small">{{ infoDetail1.currentAQLDetail.name }}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item label="反馈日期时间">
										<el-tag size="small"
											style="margin-right: 8px;">{{ infoDetail1.feedbackDateTime.date }}</el-tag>
										<el-tag size="small">{{ infoDetail1.feedbackDateTime.time }}</el-tag>
									</el-descriptions-item>
								</el-descriptions>
							</template>

							<!-- 表格2 -->
							<!-- <el-table v-if="currentTable === 'table2'" :data="table2Data">
								<el-table-column prop="date" label="日期" width="180"></el-table-column>
								<el-table-column prop="name" label="姓名" width="180"></el-table-column>
								<el-table-column prop="address" label="地址"></el-table-column>
							</el-table> -->

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
		watch
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
	import {
		useAdminStore,
	} from '@/stores/adminStore.js';
	import {
		useAQIStore,
	} from '@/stores/aqiLevelStore.js';

	import {
		useLocationStore,
	} from '@/stores/locationStore.js';

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
			const infoPageSize = ref(3);
			const small = ref(false);
			const background = ref(true);
			const disabled = ref(false)

			let selectedProvince = ref(null);
			let selectedCity = ref(null);
			let provinces = ref([]);
			let cities = ref([]);
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
			let provinceList = ref([]);
			let cityList = ref([]);

			let infoDetail1 = ref({
				id: "38",
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
				currentAQLDetail: {
					level: "四级",
					name: "中度污染",
				},
				feedbackDateTime: {
					date: "2022-10-27",
					time: "16:29:26",
				},
			});

			let infoDetail2 = ref({
				id: "38",
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
				currentAQLDetail: {
					level: "四级",
					name: "中度污染",
				},
				feedbackDateTime: {
					date: "2022-10-27",
					time: "16:29:26",
				},
			});

			let infoDetail3 = ref({
				id: "38",
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
				currentAQLDetail: {
					level: "四级",
					name: "中度污染",
				},
				feedbackDateTime: {
					date: "2022-10-27",
					time: "16:29:26",
				},
			});


			// 加载省份数据
			const loadProvinces = async () => {
				await locationStore.initLocationStore();
				provinces.value = locationStore.provinces;
				console.log(provinces.value);
			};

			// 当省份改变时更新城市数据
			const handleProvinceChange = async (provinceId) => {
				cities.value = await locationStore.getCitiesByProvinceId(provinceId);
				selectedCity.value = null; // 重置城市选择
			};

			// 初始化加载省份
			loadProvinces();

			// 观察省份选择的变化
			watch(selectedProvince, (newValue) => {
				if (newValue) {
					handleProvinceChange(newValue);
				} else {
					cities.value = [];
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

			//初始化table1
			const initTable1 = async () => {
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
					timeSupervisor: null
				});
				showInfoList1();
			};


			//初始化table2
			const initTable2 = async () => {
				updateLocation('公众监督数据管理', '公众监督数据列表');
				currentTable.value = 'table2';
				infoNum2.value = await adminStore.getInfoCount({
					status: 2,
				});
				infoPageNum2.value = Math.ceil(infoNum1.value / infoPageSize.value);
				await adminStore.fetchInfoList({
					aqiLevel: null,
					cityCode: null,
					inspectorName: null,
					pageNum: 1,
					pageSize: infoPageSize.value,
					status: 2,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});
				showInfoList2();
			};

			//初始化table3
			const initTable3 = async () => {
				updateLocation('确认AQI数据管理', '确认AQI数据列表');
				currentTable.value = 'table3';
				infoNum3.value = await adminStore.getInfoCount({
					status: 3,
				});
				infoPageNum3.value = Math.ceil(infoNum1.value / infoPageSize.value);
				await adminStore.fetchInfoList({
					aqiLevel: null,
					cityCode: null,
					inspectorName: null,
					pageNum: 1,
					pageSize: infoPageSize.value,
					status: 3,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});
				showInfoList3();
			};

			//table1页数变化
			const handleInfoPageChange1 = async (page) => {
				// console.log(infoPageNum.value);
				infoCurrentPageNum1.value = page;
				await adminStore.fetchInfoList(
				{
					aqiLevel: null,
					cityCode: null,
					inspectorName: null,
					pageNum: infoCurrentPageNum1.value,
					pageSize: infoPageSize.value,
					status: 1,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});

				showInfoList1();
			};

			//table2页数变化
			const handleInfoPageChange2 = async (page) => {
				// console.log(infoPageNum.value);
				infoCurrentPageNum2.value = page;
				await adminStore.fetchInfoList({
					aqiLevel: null,
					cityCode: null,
					inspectorName: null,
					pageNum: infoCurrentPageNum2.value,
					pageSize: infoPageSize.value,
					status: 2,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});

				showInfoList2();
			};

			//table3页数变化
			const handleInfoPageChange3 = async (page) => {
				// console.log(infoPageNum.value);
				infoCurrentPageNum3.value = page;
				await adminStore.fetchInfoList({
					aqiLevel: null,
					cityCode: null,
					inspectorName: null,
					pageNum: infoCurrentPageNum3.value,
					pageSize: infoPageSize.value,
					status: 3,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});

				showInfoList3();
			};

			//从Stores进行数据展示InfoList1
			const showInfoList1 = async () => {
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
					info.id = adminStore.infoList1[i].infoId;
					info.supervisorName = adminStore.infoList1[i].supervisorName;
					info.province = await locationStore.getProvinceByCityCode(adminStore.infoList1[i].cityCode);
					info.city = await locationStore.getCityAndProvinceByCityCode(adminStore.infoList1[i].cityCode);
					const aqiInfo = aqiStore.getAQLDetail(adminStore.infoList1[i].aqiLevel);
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
				let date = new Date();
				currentInfoList2.value = [];
				for (let i = 0; i < adminStore.infoList2.length; i++) {
					let info = {
						num: 'null',
						id: 'null',
						supervisorName: 'null',
						cityCode: 'null',
						aqiLevel: 'null',
						label: 'null',
						time: 'null',
						date: 'null',
					};
					info.num = (infoCurrentPageNum2.value - 1) * infoPageSize.value + i + 1;
					info.id = adminStore.infoList2[i].infoId;
					info.supervisorName = adminStore.infoList2[i].supervisorName;
					info.province = await locationStore.getProvinceByCityCode(adminStore.infoList2[i].cityCode);
					info.city = await locationStore.getCityAndProvinceByCityCode(adminStore.infoList2[i].cityCode);
					const aqiInfo = aqiStore.getAQLDetail(adminStore.infoList2[i].aqiLevel);
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
						timeSupervisor: 'null',
					};

					info.num = (infoCurrentPageNum3.value - 1) * infoPageSize.value + i + 1;
					info.id = adminStore.infoList3[i].infoId;
					info.inspectorName = adminStore.infoList3[i].inspectorName;
					info.supervisorName = adminStore.infoList3[i].supervisorName;
					info.province = await locationStore.getProvinceByCityCode(adminStore.infoList3[i].cityCode);
					info.city = await locationStore.getCityAndProvinceByCityCode(adminStore.infoList3[i].cityCode);
					const aqiInfo = aqiStore.getAQLDetail(adminStore.infoList3[i].aqiLevel);
					info.aqiInfo = aqiInfo.name + "(" + aqiInfo.level + ")";

					info.label = adminStore.infoList3[i].label;

					date1 = new Date(adminStore.infoList3[i].timeInspector);
					info.dateInspector =
						`${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
					info.timeInspector =
						`${String(date1.getHours()).padStart(2, '0')}:${String(date1.getMinutes()).padStart(2, '0')}:${String(date1.getSeconds()).padStart(2, '0')}`;
					currentInfoList3.value.push(info);

					date2 = new Date(adminStore.infoList3[i].timeInspector);
					info.dateInspector =
						`${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}-${String(date2.getDate()).padStart(2, '0')}`;
					info.timeInspector =
						`${String(date2.getHours()).padStart(2, '0')}:${String(date2.getMinutes()).padStart(2, '0')}:${String(date2.getSeconds()).padStart(2, '0')}`;
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
				console.log("showPointerdata:", data.id);
				const info = await adminStore.getInfoById(data.id);
				showInfoDetails1(info);

			};

			//查看table2信息的详细信息
			const showInfo2 = async (data) => {
				updateLocation('公众监督数据管理', '公众监督数据详情');
				currentTable.value = 'table21';
				const info = await adminStore.getInfoById(data.id);
				showInfoDetails2(info);
				// console.log("showPointer:", info);

			};


			//查看table3信息的详细信息
			const showInfo3 = async (data) => {
				updateLocation('确认AQI数据管理', '确认AQI数据详情');
				currentTable.value = 'table31';
				const info = await adminStore.getInfoById(data.id);
				showInfoDetails3(info);
				// console.log("showPointer:", info);
			};


			//填充table1信息的细节
			const showInfoDetails1 = async (data) => {
				infoDetail1.value.id = data.infoId;
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
				const aqiInfo = await aqiStore.getAQLDetail(data.aqiLevel);
				infoDetail1.value.currentAQLDetail.name = aqiInfo.name;
				infoDetail1.value.currentAQLDetail.level = aqiInfo.level;
				const date = new Date(data.time);
				infoDetail1.value.feedbackDateTime.date =
					`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
				infoDetail1.value.feedbackDateTime.time =
					`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
			};

			//填充table2信息的细节
			const showInfoDetails2 = async (data) => {
				infoDetail2.value.id = data.infoId;
				const supervisor = await adminStore.getSupervisorByInfoId(data.infoId);
				console.log(supervisor);
				infoDetail2.value.userInfo.name = supervisor.realName;
				infoDetail2.value.userInfo.sex = supervisor.sex;
				infoDetail2.value.userInfo.birthday = supervisor.birthday;
				infoDetail2.value.userInfo.phoneNum = supervisor.telId;
				const province = await locationStore.getProvinceByCityCode(data.cityCode);
				const city = await locationStore.getCityAndProvinceByCityCode(data.cityCode);
				infoDetail2.value.location.province = province.provinceName;
				infoDetail2.value.location.city = city.cityName;
				infoDetail2.value.address = data.address;
				infoDetail2.value.feedback = data.feedback;
				const aqiInfo = await aqiStore.getAQLDetail(data.aqiLevel);
				infoDetail2.value.currentAQLDetail.name = aqiInfo.name;
				infoDetail2.value.currentAQLDetail.level = aqiInfo.level;
				const date = new Date(data.time);
				infoDetail2.value.feedbackDateTime.date =
					`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
				infoDetail2.value.feedbackDateTime.time =
					`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
			};

			//填充table3信息的细节
			const showInfoDetails3 = async (data) => {
				infoDetail3.value.id = data.infoId;
				const supervisor = await adminStore.getSupervisorByInfoId(data.infoId);
				console.log(supervisor);
				infoDetail3.value.userInfo.name = supervisor.realName;
				infoDetail3.value.userInfo.sex = supervisor.sex;
				infoDetail3.value.userInfo.birthday = supervisor.birthday;
				infoDetail3.value.userInfo.phoneNum = supervisor.telId;
				const province = await locationStore.getProvinceByCityCode(data.cityCode);
				const city = await locationStore.getCityAndProvinceByCityCode(data.cityCode);
				infoDetail3.value.location.province = province.provinceName;
				infoDetail3.value.location.city = city.cityName;
				infoDetail3.value.address = data.address;
				infoDetail3.value.feedback = data.feedback;
				const aqiInfo = await aqiStore.getAQLDetail(data.aqiLevel);
				infoDetail3.value.currentAQLDetail.name = aqiInfo.name;
				infoDetail3.value.currentAQLDetail.level = aqiInfo.level;
				const date1 = new Date(data.timeSupervisor);
				infoDetail3.value.feedbackDateTime.dateSupervisor =
					`${date1.getFullYear()}-${String(date1.getMonth() + 1).padStart(2, '0')}-${String(date1.getDate()).padStart(2, '0')}`;
				infoDetail3.value.feedbackDateTime.timeSupervisor =
					`${String(date1.getHours()).padStart(2, '0')}:${String(date1.getMinutes()).padStart(2, '0')}:${String(date1.getSeconds()).padStart(2, '0')}`;
				const date2 = new Date(data.timeInspector);
				infoDetail3.value.feedbackDateTime.dateInspector =
					`${date2.getFullYear()}-${String(date2.getMonth() + 1).padStart(2, '0')}-${String(date2.getDate()).padStart(2, '0')}`;
				infoDetail3.value.feedbackDateTime.timeInspector =
					`${String(date2.getHours()).padStart(2, '0')}:${String(date2.getMinutes()).padStart(2, '0')}:${String(date2.getSeconds()).padStart(2, '0')}`;
			};


			//查看完信息返回到前一页（1）
			const infoBack1 = async () => {
				updateLocation('公众监督数据管理', '公众监督数据列表');
				currentTable.value = 'table1';
				infoNum1.value = await adminStore.getInfoCount({
					status: 1,
				});
				infoPageNum1.value = Math.ceil(infoNum1.value / infoPageSize.value);
				await adminStore.fetchInfoList(
				{
					aqiLevel: null,
					cityCode: null,
					inspectorName: null,
					pageNum: infoCurrentPageNum1.value,
					pageSize: infoPageSize.value,
					status: 1,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});
				// console.log(adminStore.infoList);
				showInfoList1();
			};

			//查看完信息返回到前一页（2）
			const infoBack2 = async () => {
				updateLocation('公众监督数据管理', '公众监督数据列表');
				currentTable.value = 'table2';

				infoNum2.value = await adminStore.getInfoCount({
					status: 1,
				});
				infoPageNum2.value = Math.ceil(infoNum2.value / infoPageSize.value);
				await adminStore.fetchInfoList({
					aqiLevel: null,
					cityCode: null,
					inspectorName: null,
					pageNum: infoCurrentPageNum2.value,
					pageSize: infoPageSize.value,
					status: 2,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});
				// console.log(adminStore.infoList);
				showInfoList2();
			};

			//查看完信息返回到前一页（3）
			const infoBack3 = async () => {
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
					pageNum: infoCurrentPageNum3.value,
					pageSize: infoPageSize.value,
					status: 3,
					supervisorName: null,
					timeInspector: null,
					timeSupervisor: null
				});
				// console.log(adminStore.infoList);
				showInfoList3();
			};

			const showPointer = async (data) => {
				updateLocation('公众监督数据管理', '公众监督数据详情');
				currentTable.value = 'table12';
				const info = await adminStore.getInfoById(data.id);
				showInfoDetails1(info);
				// console.log("showPointer:", info);
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
				loadProvinces,
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
				selectedProvince,
				selectedCity,
				provinces,
				cities,
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