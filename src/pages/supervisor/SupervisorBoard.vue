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
          <div v-if="currentTable === 'feedbackList'">
            <el-table :data="currentInfoList" style="width: 100%">
              <el-table-column prop="aqiLevel" label="污染等级" width="100"></el-table-column>
              <el-table-column prop="time" label="反馈时间" width="200"></el-table-column>
              <el-table-column prop="province" label="省份" width="200"></el-table-column>
              <el-table-column prop="city" label="城市" width="200"></el-table-column>
              <el-table-column prop="address" label="具体位置" width="200"></el-table-column>
              <el-table-column prop="feedback" label="描述" width="300"></el-table-column>
            </el-table>
          </div>
              
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
    const supervisorStore = useSupervisorStore();

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
      await processFeedbackList();
    };

    const processFeedbackList = async () => {
      // Processing and formatting of feedback list data
      // Populate currentInfoList with the formatted data
      // await supervisorStore.supervisorFeedbackList();
      // const feedbackList = supervisorStore.feedbackList;
      // const formattedFeedbackList = feedbackList.map((item) => {
      //   const { aqiLevel, time, province, city, address, feedback } = item;
      //   return { aqiLevel, time, province, city, address, feedback };
      // });
      // currentInfoList.value = formattedFeedbackList;
      await supervisorStore.supervisorFeedbackList();


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