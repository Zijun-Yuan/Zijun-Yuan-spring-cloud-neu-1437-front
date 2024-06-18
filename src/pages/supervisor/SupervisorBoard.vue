<template>
  <div class="common-layout">
    <el-header class="layout-header">东软环保公众监督平台监督员系统</el-header>
    <el-container class="layout-container-demo">
      <el-aside width="300px">
        <el-scrollbar>
          <el-menu :default-openeds="['1']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon> <Message /> </el-icon>
                <span class="menu-title">公众监督员功能</span>
              </template>
              <el-menu-item index="1-1" @click="getFeedbackList">
                历史反馈信息列表
              </el-menu-item>
              <el-menu-item index="1-2" @click="reportGridInformation">
                上报网格信息
              </el-menu-item>
              <el-menu-item index="1-3" @click="browsePersonalInfo">
                浏览个人信息
              </el-menu-item>
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
          <!-- Your main content goes here -->
<!--          <div v-if="currentTable === 'feedbackList'">-->
<!--            <el-table :data="currentInfoList" style="width: 100%">-->
              
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSupervisorStore } from '@/stores/supervisorStore';
import { Message, Location, Person } from '@element-plus/icons-vue';

export default {
  name: 'PublicSupervisorBoard',
  components: {
    Message,
    Location,
    Person,
  },
  setup() {
    const router = useRouter();
    const mainTitle = ref('');
    const subTitle = ref('');
    const formattedTitle = ref(`${mainTitle.value} / ${subTitle.value}`);
    const SupervisorStore = useSupervisorStore();

    let currentTable = ref('');
    let currentInfoList = ref([]);

    watch([mainTitle, subTitle], ([newMainTitle, newSubTitle]) => {
      formattedTitle.value = `${newMainTitle} / ${newSubTitle}`;
    });

    const updateLocation = (newMainTitle, newSubTitle) => {
      mainTitle.value = newMainTitle;
      subTitle.value = newSubTitle;
    };

    const getFeedbackList = async () => {
      updateLocation('公众监督员功能', '历史反馈信息列表');
      currentTable.value = 'feedbackList';
      processFeedbackList();
    };

    const processFeedbackList = () => {
      // Processing and formatting of feedback list data
      // Populate currentInfoList with the formatted data
    };

    const reportGridInformation = () => {
      updateLocation('公众监督员功能', '上报网格信息');
      // Add logic to report grid information
    };

    const browsePersonalInfo = () => {
      updateLocation('公众监督员功能', '浏览个人信息');
      // Add logic to browse personal information
    };

    return {
      formattedTitle,
      updateLocation,
      mainTitle,
      subTitle,
      currentTable,
      currentInfoList,
      getFeedbackList,
      processFeedbackList,
      reportGridInformation,
      browsePersonalInfo,
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