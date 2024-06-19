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
								<el-menu-item index="1-1" @click="initPublicSupervisionDataList">公众监督数据列表</el-menu-item>
								<el-menu-item index="1-2" @click="confirmAQIDataList">确认AQI数据列表</el-menu-item>
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
						<el-scrollbar>
							<!-- 公众监督员信息列表 -->
							<el-table v-if="currentTable === 'table1'" :data="currentInfoList">
								<el-table-column prop="num" label="编号" width="100"></el-table-column>
								<el-table-column prop="supervisorName" label="反馈者姓名" width="180"></el-table-column>
								<el-table-column prop="province.provinceName" label="所在省" width="100"></el-table-column>
								<el-table-column prop="city.cityName" label="所在市" width="100"></el-table-column>
								<el-table-column prop="aqiInfo" label="预估污染等级" width="130"></el-table-column>
								<el-table-column prop="date" label="反馈日期" width="180"></el-table-column>
								<el-table-column prop="time" label="反馈时间" width="180"></el-table-column>
								<el-table-column label="操作" width="180">
									<template v-slot="scope">
										<el-button type="primary" circle @click="showInfo(scope.row)">
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
							<!-- 信息列表页码 -->
							<el-pagination v-model="infoCurrentPageNum" :current-page="infoCurrentPageNum"
								v-if="currentTable === 'table1'" :small="small" :disabled="disabled"
								:background="background" layout="prev, pager, next, jumper" :page-count="infoPageNum"
								@current-change="handleInfoPageChange" />
							<!-- 详细信息 -->
							<template v-if="currentTable === 'table2'">
								<el-descriptions class="margin-top" title="公众监督信息详情" :column="1" :size="size" border>
									<template #extra>
										<el-button type="primary" color="#98c8f2" @click="infoBack">返回</el-button>
									</template>
									<el-descriptions-item label="公众监督反馈信息编号">
										{{ feedbackDetails.id }}
									</el-descriptions-item>
									<el-descriptions-item label="反馈者信息">
										<el-tag size="small"style="margin-right: 8px;">{{ feedbackDetails.location.province }}</el-tag>
										<el-tag size="small"style="margin-right: 8px;">{{ feedbackDetails.location.province }}</el-tag>
										<el-tag size="small">{{ feedbackDetails.location.province }}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item label="反馈者联系电话">
										{{ feedbackDetails.userInfo.phoneNum }}
									</el-descriptions-item>
									<el-descriptions-item label="反馈信息所在地址">
										<el-tag size="small"style="margin-right: 8px;">{{ feedbackDetails.location.province }}</el-tag>
										<el-tag size="small"style="margin-right: 8px;">{{ feedbackDetails.location.city }}</el-tag>
										<el-tag size="small">{{ feedbackDetails.address }}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item label="反馈信息表述">
										{{ feedbackDetails.feedback }}
									</el-descriptions-item>
									<el-descriptions-item label="预估等级">
										<el-tag size="small"style="margin-right: 8px;">{{ feedbackDetails.currentAQLDetail.level }}</el-tag>
										<el-tag size="small">{{ feedbackDetails.currentAQLDetail.name }}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item label="反馈日期时间">
										<el-tag size="small"style="margin-right: 8px;">{{ feedbackDetails.feedbackDateTime.date }}</el-tag>
										<el-tag size="small">{{ feedbackDetails.feedbackDateTime.time }}</el-tag>
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
			let currentTable = ref({});
			let currentInfoList = ref([]);
			let infoPageNum = ref(0);
			let infoCurrentPageNum = ref(1);
			const infoPageSize = ref(2);
			let infoNum = ref(0);
			const small = ref(false);
			const background = ref(true);
			const disabled = ref(false)
			let feedbackDetails = ref({
				id: "38",
				userInfo: {
					name: "欧阳锋",
					sex:"男",
					birthday: "1980-11-13",
					phoneNum:"17345988896",
				},
				location:{
					province:"辽宁省",
					city:"大连市",
				},
				address: "甘井子区凌风街乘风社区",
				feedback:"月黑风高，空气浑浊，难道是杀人夜？",
				currentAQLDetail:{
					level:"四级",
					name:"中度污染",
				},
				feedbackDateTime:{
					date:"2022-10-27",
					time:"16:29:26",
				},
			});

			watch([mainTitle, subTitle], ([newMainTitle, newSubTitle]) => {
				formattedTitle.value = `${newMainTitle} / ${newSubTitle}`;
			});

			//更新导航位置
			const updateLocation = (newMainTitle, newSubTitle) => {
				mainTitle.value = newMainTitle;
				subTitle.value = newSubTitle;
			};

			//初始化公众监督信息列表
			const initPublicSupervisionDataList = async () => {
				updateLocation('公众监督数据管理', '公众监督数据列表');
				currentTable.value = 'table1';
				infoNum.value = await adminStore.getInfoCount();
				infoPageNum.value = Math.ceil(infoNum.value / infoPageSize.value);
				await adminStore.fetchInfoList(1, infoPageSize.value);
				// console.log(adminStore.infoList);
				showInfoList();
			};

			//公众监督信息列表页数变化
			const handleInfoPageChange = async (page) => {
				// console.log("currentPage",page);
				infoCurrentPageNum.value = page;
				await adminStore.fetchInfoList(infoCurrentPageNum.value, infoPageSize.value);
				currentInfoList.value = [];
				showInfoList();
			};

			//从Stores进行数据展示InfoList
			const showInfoList = async() => {
				// console.log("showingInfoList...");
				// console.log("infoCurrentPageNum:"+infoCurrentPageNum.value);
				// console.log("infoPageSize:"+infoPageSize.value);
				let date = new Date();
				// console.log(adminStore.infoList.length);
				currentInfoList.value = [];
				for (let i = 0; i < adminStore.infoList.length; i++) {
					let info = {
						num: 'null',
						id: 'null',
						supervisorName: 'null',
						cityCode: 'null',
						aqiLevel: 'null',
						label: 'null',
						time: 'null',
					};

					info.num = (infoCurrentPageNum.value - 1) * infoPageSize.value + i + 1;
					info.id = adminStore.infoList[i].infoId;
					info.supervisorName = adminStore.infoList[i].supervisorName;
					info.province = await locationStore.getProvinceByCityCode(adminStore.infoList[i].cityCode);
					info.city = await locationStore.getCityAndProvinceByCityCode(adminStore.infoList[i].cityCode);

					// info.cityCode = adminStore.infoList[i].cityCode;
					// console.log(adminStore.infoList[i].aqiLevel);
					const aqiInfo = aqiStore.getAQLDetail(adminStore.infoList[i].aqiLevel);
					info.aqiInfo = aqiInfo.name +"("+aqiInfo.level+")";


					// console.log(aqiStore.getAQLDetail(info.aqiLevel));

					info.label = adminStore.infoList[i].label;
					
					date = new Date(adminStore.infoList[i].time);
					info.date =
						`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
					info.time =
						`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
					currentInfoList.value.push(info);
					// console.log(currentInfoList.value[i]);
					// console.log(i);
				}

				// console.log(adminStore.infoList);
			};


			//查看某一信息的详细信息
			const showInfo = (data) => {
				updateLocation('公众监督数据管理', '公众监督数据详情');
				currentTable.value = 'table2';
				updateFeedbackDetails(data);
				console.log("showPointer:", data.id);
				console.log("showPointer:", data);
			};
			
			const updateFeedbackDetails = (data) => {
				feedbackDetails.value.id = data.id;
				
				// feedbackDetails.value.userInfo.name = data.id;
				// feedbackDetails.value.userInfo.sex = data.id;
				// feedbackDetails.value.userInfo.birthday = data.id;
				// feedbackDetails.value.userInfo = data.id;
				
				feedbackDetails.value.location.province = data.id;
				feedbackDetails.value.location.city = data.id;
				feedbackDetails.value.id = data.id;
				feedbackDetails.value.id = data.id;
				
				feedbackDetails.value.id = data.id;
				feedbackDetails.value.id = data.id;
				feedbackDetails.value.id = data.id;
				feedbackDetails.value.id = data.id;
				
				feedbackDetails = ref({
					id: "38",
					userInfo: {
						name: "欧阳锋",
						sex:"男",
						birthday: "1980-11-13",
						phoneNum:"17345988896",
					},
					location:{
						province:"辽宁省",
						city:"大连市",
					},
					address: "甘井子区凌风街乘风社区",
					feedback:"月黑风高，空气浑浊，难道是杀人夜？",
					currentAQLDetail:{
						level:"四级",
						name:"中度污染",
					},
					feedbackDateTime:{
						date:"2022-10-27",
						time:"16:29:26",
					},
				});
				updateLocation('公众监督数据管理', '公众监督数据详情');
				currentTable.value = 'table2';
				updateFeedbackDetails();
				console.log("showPointer:", data.id);
				
			};

			//查看完信息返回到前一页
			const infoBack = async () => {
				updateLocation('公众监督数据管理', '公众监督数据列表');
				currentTable.value = 'table1';
				infoNum.value = await adminStore.getInfoCount();
				infoPageNum.value = Math.ceil(infoNum.value / infoPageSize.value);
				await adminStore.fetchInfoList(infoCurrentPageNum.value, infoPageSize.value);
				// console.log(adminStore.infoList);
				showInfoList();
			};

			const showPointer = (data) => {
				locationStore.test();
				console.log("showPointer:", data.id);
			};

			const confirmAQIDataList = () => {
				currentTable.value = 'table2';
				updateLocation('公众监督数据管理', '确认AQI数据列表');
				adminStore.setToken('hello');
			};

			const getProvinceGroupedInspectionStats = () => {
				currentTable.value = 'table3';
				updateLocation('统计数据管理', '省分组检查统计');
			};

			const getAQIDistributionStats = () => {
				currentTable.value = 'table4';
				updateLocation('统计数据管理', 'AQI指数分布统计');
			};

			const getAQITrendStats = () => {
				currentTable.value = 'table5';
				updateLocation('统计数据管理', 'AQI指数趋势统计');
			};

			const getOtherDataStats = () => {
				currentTable.value = 'table6';
				updateLocation('统计数据管理', '其他数据统计');
			};

			return {
				formattedTitle,
				updateLocation,
				mainTitle,
				subTitle,
				small,
				background,
				disabled,
				currentTable,
				currentInfoList,
				infoNum,
				infoPageSize,
				infoPageNum,
				infoCurrentPageNum,
				initPublicSupervisionDataList,
				showInfoList,
				confirmAQIDataList,
				getProvinceGroupedInspectionStats,
				getAQIDistributionStats,
				getAQITrendStats,
				getOtherDataStats,
				handleInfoPageChange,
				showInfo,
				showPointer,
				feedbackDetails,
				updateFeedbackDetails,
				infoBack,
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