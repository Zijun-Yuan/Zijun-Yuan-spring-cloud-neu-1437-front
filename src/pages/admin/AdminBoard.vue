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
							<el-table v-if="currentTable === 'table1'" :data="currentInfoList">
								<el-table-column prop="num" label="编号" width="100"></el-table-column>
								<el-table-column prop="supervisorName" label="反馈者姓名" width="180"></el-table-column>
								<el-table-column prop="cityCode" label="所在省" width="100"></el-table-column>
								<el-table-column prop="cityCode" label="所在市" width="100"></el-table-column>
								<el-table-column prop="aqiLevel" label="预估污染等级" width="130"></el-table-column>
								<el-table-column prop="date" label="反馈日期" width="180"></el-table-column>
								<el-table-column prop="time" label="反馈时间" width="180"></el-table-column>
								<el-icon><i class="el-icon-view"></i></el-icon>
								<el-icon><i class="el-icon-edit"></i></el-icon>
							</el-table>
							<!-- 表格2 -->
							<!-- <el-table v-if="currentTable === 'table2'" :data="table2Data">
								<el-table-column prop="date" label="日期" width="180"></el-table-column>
								<el-table-column prop="name" label="姓名" width="180"></el-table-column>
								<el-table-column prop="address" label="地址"></el-table-column>
							</el-table> -->
							  <el-pagination
							        v-model:currentPage="infoCurrentPageNum"
							        v-model:page-size="infoPageSize"
							        :small="small"
							        :disabled="disabled"
							        :background="background"
							        layout="prev, pager, next, jumper"
							        :total="infoNum"
							        @current-change="handleCurrentChange"
							      />
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
		Setting
	} from '@element-plus/icons-vue';
	import {
		useAdminStore
	} from '@/stores/adminStore.js';

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
			const formattedTitle = ref(`${mainTitle.value} / ${subTitle.value}`);
			const adminStore = useAdminStore();
			let currentTable = ref('');
			let currentInfoList = ref([]);
			let infoPageNum = ref(0);
			let infoCurrentPageNum =  ref(1);
			const infoPageSize = ref(2);
			let infoNum = ref(0);
			
			const small = ref(false)
			const background = ref(false)
			const disabled = ref(false)
			watch([mainTitle, subTitle], ([newMainTitle, newSubTitle]) => {
				formattedTitle.value = `${newMainTitle} / ${newSubTitle}`;
			});

			const updateLocation = (newMainTitle, newSubTitle) => {
				mainTitle.value = newMainTitle;
				subTitle.value = newSubTitle;
			};


			const initPublicSupervisionDataList = async () => {
				updateLocation('公众监督数据管理', '公众监督数据列表');
				currentTable.value = 'table1';
				infoNum.value = await adminStore.getInfoCount();
				infoPageNum.value = Math.ceil(infoNum.value / infoPageSize.value);
				await adminStore.fetchInfoList(1,infoPageSize.value);
				// console.log(adminStore.infoList);
				showInfoList();
			};
			
			const handleInfoPageChange = async (val) => {	
				// console.log(""val);
			    adminStore.fetchInfoList(infoCurrentPageNum.value, infoPageSize);
				currentInfoList = [];
			    showInfoList();
			};


			const showInfoList = () => {
				
				let date = new Date();
				// console.log(adminStore.infoList.length);
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
					date = new Date(adminStore.infoList[i].time);
					console.log("infoCurrentPageNum:"+infoCurrentPageNum.value);
					console.log("infoPageSize:"+infoPageSize.value);
					info.num = (infoCurrentPageNum.value-1)*infoPageSize.value + i + 1;
					info.id = adminStore.infoList[i].infoId;
					info.supervisorName = adminStore.infoList[i].supervisorName;
					info.cityCode = adminStore.infoList[i].cityCode;
					info.aqiLevel = adminStore.infoList[i].aqiLevel;
					info.label = adminStore.infoList[i].label;
					info.date =
						`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
					info.time =
						`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
					currentInfoList.value.push(info);
					console.log(currentInfoList.value[i]);
					console.log(i);
				}

				// console.log(adminStore.infoList);
			};


			const confirmAQIDataList = () => {
				updateLocation('公众监督数据管理', '确认AQI数据列表');
				adminStore.setToken('hello');
			};

			const getProvinceGroupedInspectionStats = () => {
				updateLocation('统计数据管理', '省分组检查统计');
			};

			const getAQIDistributionStats = () => {
				updateLocation('统计数据管理', 'AQI指数分布统计');
			};

			const getAQITrendStats = () => {
				updateLocation('统计数据管理', 'AQI指数趋势统计');
			};

			const getOtherDataStats = () => {
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