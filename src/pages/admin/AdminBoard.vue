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
								<el-menu-item index="1-1" data-parent="公众监督数据管理">公众监督数据列表</el-menu-item>
								<el-menu-item index="1-2" data-parent="公众监督数据管理">确认AQI数据列表</el-menu-item>
							</el-sub-menu>
							<el-sub-menu index="2">
								<template #title>
									<el-icon>
										<IconMenu />
									</el-icon>
									<span class="menu-title">统计数据管理</span>
								</template>
								<el-menu-item index="2-1" data-parent="统计数据管理">省分组检查统计</el-menu-item>
								<el-menu-item index="2-2" data-parent="统计数据管理">AQI指数分布统计</el-menu-item>
								<el-menu-item index="2-3" data-parent="统计数据管理">AQI指数趋势统计</el-menu-item>
								<el-menu-item index="2-4" data-parent="统计数据管理">其他数据统计</el-menu-item>
							</el-sub-menu>
							<el-sub-menu index="3">
								<template #title>
									<el-icon>
										<Setting />
									</el-icon>
									<span class="menu-title">网格数据管理</span>
								</template>
								<!-- Example of menu items under "网格数据管理" -->
								<el-menu-item index="3-1" data-parent="网格数据管理">网格数据列表</el-menu-item>
								<el-menu-item index="3-2" data-parent="网格数据管理">网格数据分析</el-menu-item>
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
							<!-- <el-table :data="tableData">
								<el-table-column prop="date" label="Date" width="140" />
								<el-table-column prop="name" label="Name" width="120" />
								<el-table-column prop="address" label="Address" />
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
		ref
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import {
		Menu as IconMenu,
		Message,
		Setting
	} from '@element-plus/icons-vue';

	export default {
		name: 'AdminBoard',
		components: {
			IconMenu,
			Message,
			Setting,
		},
		setup() {
			const router = useRouter();
			const mainTitle = ref('Tom');
			const subTitle = ref('');
			const formattedTitle = ref(mainTitle.value);

			const handleSelect = (index, indexPath) => {
				const selectedItem = document.querySelector(`.el-menu-item[index="${index}"]`);
				if (selectedItem) {
					const parentTitle = selectedItem.getAttribute('data-parent');
					const itemTitle = selectedItem.innerText;
					mainTitle.value = parentTitle;
					subTitle.value = itemTitle;
					formattedTitle.value = `${mainTitle.value} / ${subTitle.value}`;
					console.log(formattedTitle.value);
				}
			};

			return {
				formattedTitle,
				handleSelect,
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
