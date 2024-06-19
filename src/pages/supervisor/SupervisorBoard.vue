<template>
  <div class="common-layout">
    <el-header class="layout-header">东软环保公众监督平台监督员系统</el-header>
    <el-container class="layout-container-demo">
      <el-aside width="300px">
        <el-scrollbar>
          <el-menu :default-openeds="['1']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Message/>
                </el-icon>
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
          <el-scrollbar>
            <div v-if="currentTable === ''">
              <img src="@/assets/images/SupervisorLogin.jpg" alt="Placeholder Image"/>
            </div>

            <el-table v-if="currentTable === 'feedbackList'" :data="currentInfoList" style="width: 100%">
              <el-table-column prop="aqiLevel" label="污染等级" width="100"></el-table-column>
              <el-table-column prop="date" label="反馈日期" width="200"></el-table-column>
              <el-table-column prop="time" label="反馈时间" width="200"></el-table-column>
              <el-table-column prop="province" label="省份" width="200"></el-table-column>
              <el-table-column prop="city" label="城市" width="200"></el-table-column>
              <el-table-column prop="address" label="具体位置" width="200"></el-table-column>
              <el-table-column prop="feedback" label="描述" width="300"></el-table-column>
            </el-table>

            <div v-else-if="currentTable ==='reportGridInformation'">
              <el-form ref="reportGridForm" label-width="100px">
              </el-form>
            </div>

          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {nextTick, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useSupervisorStore} from '@/stores/supervisorStore';
import {useLocationStore} from "@/stores/locationStore";
import {Message, Location, Person} from '@element-plus/icons-vue';

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
    const locationStore = useLocationStore();

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
      // await supervisorStore.supervisorFeedbackList();
      // updateLocation('公众监督员功能', '历史反馈信息列表');
      // currentTable.value = 'feedbackList';
      //
      // processFeedbackList();
      try {
        await supervisorStore.supervisorFeedbackList();
        updateLocation('公众监督员功能', '历史反馈信息列表');
        currentTable.value = 'feedbackList';
        console.log("进入feedbackList");
        console.log(supervisorStore.feedbackList);
        processFeedbackList();
      } catch (error) {
        console.log(error);
      }
    };

    const processFeedbackList = () => {
      currentInfoList.value = []; // 重置数组
      let date = new Date();
      for (let i = 0; i < supervisorStore.feedbackList.length; i++) {
        console.log(i);
        let info = {
          aqiLevel: "null",
          date: "null",
          time: "null",
          province: "null",
          city: "null",
          address: "null",
          feedback: "null"
        };
        date = new Date(supervisorStore.feedbackList[i].time);

        info.aqiLevel = supervisorStore.feedbackList[i].aqiLevel;
        info.province = supervisorStore.feedbackList[i].province;
        info.city = supervisorStore.feedbackList[i].city;
        info.address = supervisorStore.feedbackList[i].address;
        info.feedback = supervisorStore.feedbackList[i].feedback;

        const cityRes = locationStore.getCityAndProvinceByCityCode(supervisorStore.feedbackList[i].cityCode);
        const provinceRes = locationStore.getProvinceByCityCode(supervisorStore.feedbackList[i].cityCode);
        console.log(cityRes);
        console.log(provinceRes);

        info.date =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        info.time =
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        currentInfoList.value.push(info);
        console.log(currentInfoList.value[i]);
      }

    };

    const reportGridInformation = () => {
      updateLocation('公众监督员功能', '上报网格信息');
      currentTable.value = 'reportGridInformation';

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