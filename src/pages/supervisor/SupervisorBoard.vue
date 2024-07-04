<template>
  <el-backtop :right="100" :bottom="100"/>
  <div class="common-layout">
    <el-header class="layout-header">
      <el-row :gutter="20" justify="space-between">
        <el-col :span="12">
          <div class="system-title">
            <b>东软环保公众监督平台监督员系统</b>
          </div>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <div class="welcome-message">
            欢迎使用本系统，{{ supervisorStore.supervisor.realName }}监督员
          </div>
          <el-button type="danger" @click="logout">退出登录</el-button>
        </el-col>
      </el-row>
    </el-header>

    <!-- 左侧菜单栏 -->
    <el-container class="layout-container-demo">
      <el-aside width="300px">
        <el-scrollbar>
          <el-menu :default-openeds="['1']" :default-active="defaultActive">
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

        <!-- 主页面内容 -->
        <el-main>
          <el-scrollbar>
            <div v-if="currentTable === ''">
              <img src="@/assets/images/SupervisorLogin.jpg" alt="Placeholder Image"/>
            </div>

            <!-- 历史反馈信息列表 -->
            <el-table v-if="currentTable === 'feedbackList'" :data="currentInfoList"
                      empty-text="目前没有历史反馈信息"
                      style="width: 100%">
              <el-table-column type="index" label="序号" width="80">
                <template #header>
                  <span>序号</span>
                  <el-button type="text" icon="el-icon-sort" @click="sortDescending"></el-button>
                </template>
              </el-table-column>
              <el-table-column prop="aqiLevel" label="污染等级" width="100"></el-table-column>
              <el-table-column prop="date" label="反馈日期" width="150"></el-table-column>
              <el-table-column prop="time" label="反馈时间" width="150"></el-table-column>
              <el-table-column prop="province.provinceName" label="省份" width="100"></el-table-column>
              <el-table-column prop="city.cityName" label="城市" width="100"></el-table-column>
              <el-table-column prop="address" label="具体位置" width="200"></el-table-column>
              <el-table-column prop="feedback" label="描述" width="300"></el-table-column>
            </el-table>

            <!-- 上报网格信息 -->
            <el-form v-else-if="currentTable === 'reportGridInformation'" ref="reportGridForm" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="所在省">
                    <el-select v-model="reportForm.province" placeholder="请选择省份" style="width: 100%;"
                               @change="handleProvinceChange">
                      <el-option v-for="province in provinces" :key="province.provinceId" :label="province.provinceName"
                                 :value="province.provinceId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="所在市">
                    <el-select v-model="reportForm.city" placeholder="请选择城市" style="width: 100%;"
                               :disabled="!reportForm.province">
                      <el-option v-for="city in cities" :key="city.cityCode" :label="city.cityName"
                                 :value="city.cityCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-col :span="16">
                <el-form-item label="地址">
                  <el-input v-model="reportForm.address" placeholder="填写具体地址" style="width: 100%;"></el-input>
                </el-form-item>
              </el-col>
              <el-form-item label="空气质量等级">
                <el-table :data="aqiLevelDescriptions" border style="width: 100%">
                  <el-table-column prop="level" label="等级" width="50"></el-table-column>
                  <el-table-column prop="quality" label="质量" width="100"></el-table-column>
                  <el-table-column prop="description" label="描述"></el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="等级预估">
                <el-row type="flex" justify="center">
                  <el-col :span="24">
                    <el-radio-group v-model="reportForm.aqiLevel">
                      <el-radio :value="1" style="color: green;">一</el-radio>
                      <el-radio :value="2" style="color: lightgreen;">二</el-radio>
                      <el-radio :value="3" style="color: yellow;">三</el-radio>
                      <el-radio :value="4" style="color: orange;">四</el-radio>
                      <el-radio :value="5" style="color: red;">五</el-radio>
                      <el-radio :value="6" style="color: brown;">六</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="反馈信息">
                <el-input v-model="reportForm.feedback" type="textarea" rows="4"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitReport">提交</el-button>
              </el-form-item>
            </el-form>

            <!-- 浏览个人信息 -->
            <el-form v-else-if="currentTable === 'browsePersonalInfoTable'" ref="personalInfoForm" :model="personalInfo"
                     label-width="100px">
              <el-form-item>
                <el-tag type="info" class="custom-tag">基本信息</el-tag>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="personalInfo.realName" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-select v-model="personalInfo.sex" placeholder="请选择性别">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日">
                <el-date-picker v-model="personalInfo.birthday" type="date" placeholder="选择生日"></el-date-picker>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="personalInfo.telId" placeholder="用户名(电话号码)"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updatePersonalInfo">更新</el-button>
              </el-form-item>
            </el-form>

          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {ref, watch, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useSupervisorStore} from '@/stores/supervisorStore';
import {useLocationStore} from "@/stores/locationStore";
import {useAQIStore} from "@/stores/aqiLevelStore";
import {Message, Location, Person} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";
import {ElMessageBox} from "element-plus/lib/components";

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
    const aqiLevelStore = useAQIStore();
    const defaultActive = ref('1-1');

    let currentTable = ref('');
    let currentInfoList = ref([]);
    let provinces = ref([]);
    let cities = ref([]);

    // 监听路由变化，更新标题
    const sortDescending = () => {
      currentInfoList.value = [...currentInfoList.value].reverse();
    };

    // 表单
    const reportForm = ref({
      province: '',
      city: '',
      address: '',
      aqiLevel: '',
      feedback: '',
    });

    // AQI等级描述
    const aqiLevelDescriptions = [
      {level: '一', quality: '优', description: '空气质量令人满意，基本无空气污染'},
      {level: '二', quality: '良', description: '空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响'},
      {level: '三', quality: '轻度污染', description: '易感人群症状有轻度加剧，健康人群出现刺激症状'},
      {level: '四', quality: '中度污染', description: '进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响'},
      {
        level: '五',
        quality: '重度污染',
        description: '心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状'
      },
      {level: '六', quality: '严重污染', description: '健康人群运动耐受力降低，有明显强烈症状，提前出现某些疾病'}
    ];

    // 个人信息
    const personalInfo = ref({
      realName: '',
      sex: '',
      birthday: '',
      telId: '',
    });

    // 监听supervisorStore中的数据变化
    watch([mainTitle, subTitle], ([newMainTitle, newSubTitle]) => {
      formattedTitle.value = `${newMainTitle} / ${newSubTitle}`;
    });

    // 退出账号方法
    const logout = () => {
      ElMessageBox.confirm('确定要退出当前账号吗？', '登出当前账号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        cancelButtonClass: 'el-button--info'
      }).then(() => {
        supervisorStore.logout();
        router.push('/supervisor/login');
      }).catch(() => {
        // 用户点击取消
      });
    }

    // 更新标题方法
    const updateLocation = (newMainTitle, newSubTitle) => {
      mainTitle.value = newMainTitle;
      subTitle.value = newSubTitle;
    };

    // 获取反馈信息列表
    const getFeedbackList = async () => {
      try {
        await supervisorStore.supervisorFeedbackList();
        updateLocation('公众监督员功能', '历史反馈信息列表');
        currentTable.value = 'feedbackList';
        await processFeedbackList();
      } catch (error) {
        console.log(error);
      }
    };

    // 处理反馈信息列表
    const processFeedbackList = async () => {
      currentInfoList.value = []; // 重置数组
      let date = new Date();
      console.log(supervisorStore.feedbackList);
      for (let i = 0; i < supervisorStore.feedbackList.length; i++) {
        let info = {
          aqiLevel: "null",
          date: "null",
          time: "null",
          province: "null",
          city: "null",
          address: "null",
          feedback: "null"
        };
        date = new Date(supervisorStore.feedbackList[i].timeSupervisor);

        const aqiInfo = aqiLevelStore.getAQIDetail(supervisorStore.feedbackList[i].aqiLevel);
        info.aqiLevel = aqiInfo.name + "(" + aqiInfo.level + ")";
        info.address = supervisorStore.feedbackList[i].address;
        info.feedback = supervisorStore.feedbackList[i].feedback;

        info.city = await locationStore.getCityAndProvinceByCityCode(supervisorStore.feedbackList[i].cityCode);
        info.province = await locationStore.getProvinceByCityCode(supervisorStore.feedbackList[i].cityCode);

        info.date =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        info.time =
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        currentInfoList.value.push(info);
      }
      //currentInfoList.value.reverse();
    };

    // 上报网格信息
    const reportGridInformation = () => {
      updateLocation('公众监督员功能', '上报网格信息');
      currentTable.value = 'reportGridInformation';
    };

    // 信息上报
    const submitReport = async () => {
      // 检查表单是否填写完整
      if (!reportForm.value.province || !reportForm.value.city || !reportForm.value.address || !reportForm.value.aqiLevel || !reportForm.value.feedback) {
        ElMessage.warning('请填写完整信息');
      }
      const reportData = {
        status: 1,
        aqiLevel: reportForm.value.aqiLevel,
        cityCode: reportForm.value.city,
        address: reportForm.value.address,
        feedback: reportForm.value.feedback,
        // time是当前的时间，格式为yyyy-MM-dd'T'HH:mm:ss
        timeSupervisor: new Date().toISOString().slice(0, 19),
        supervisorName: supervisorStore.supervisor.realName
      }

      if (await supervisorStore.addFeedback(reportData)) {
        ElMessage.success({message: '信息上传成功，感谢您的反馈！'});
        defaultActive.value = '1-1';
        await getFeedbackList();
        reportForm.value = {
          province: '',
          city: '',
          address: '',
          aqiLevel: '',
          feedback: '',
        };
      } else {
        console.log("反馈信息失败");
        ElMessage.error({message: '反馈信息失败，请稍后再试！'});
      }
    };

    // 浏览个人信息
    const browsePersonalInfo = () => {
      personalInfo.value.realName = supervisorStore.supervisor.realName;
      personalInfo.value.sex = (supervisorStore.supervisor.sex === 1 ? "男" : "女");
      personalInfo.value.birthday = supervisorStore.supervisor.birthday;
      personalInfo.value.telId = supervisorStore.supervisor.telId;
      updateLocation('公众监督员功能', '浏览个人信息');
      currentTable.value = 'browsePersonalInfoTable';
    };

    // 更新个人信息
    const updatePersonalInfo = async () => {
      // 首先判断是否有表单为空
      if (!personalInfo.value.realName || !personalInfo.value.birthday || !personalInfo.value.telId) {
        ElMessage.warning('有为空的信息项，请填写完整');
      } else {
        // 否则开始更新个人信息
        if (await supervisorStore.updateSupervisor(personalInfo.value)) {
          ElMessage.success({message: '个人信息更新成功！'});
        } else {
          ElMessage.error({message: '该电话号码已被注册，请更换电话号码！'});
        }
      }
    };

    // 监听省份变化
    const handleProvinceChange = async (provinceId) => {
      if (provinceId) {
        cities.value = await locationStore.getCitiesByProvinceId(provinceId);
        reportForm.value.city = '';
      } else {
        cities.value = [];
        reportForm.value.city = '';
      }
    };

    onMounted(async () => {
      provinces.value = await locationStore.getAllProvinces();
    });

    return {
      supervisorStore,
      formattedTitle,
      reportForm,
      personalInfo,
      aqiLevelDescriptions,
      defaultActive,
      sortDescending,
      submitReport,
      updateLocation,
      logout,
      mainTitle,
      subTitle,
      currentTable,
      currentInfoList,
      getFeedbackList,
      processFeedbackList,
      reportGridInformation,
      browsePersonalInfo,
      provinces,
      cities,
      handleProvinceChange,
      updatePersonalInfo,
    };
  },
};
</script>

<style scoped>
/* 样式可以根据需要自行调整 */
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

.system-title {
  font-size: 20px;
  color: white;
}

.welcome-message {
  font-size: 16px;
  color: white;
  display: inline-block;
  margin-right: 10px;
}

.custom-tag {
  background-color: #7777e3;
  border-color: #7777e3;
  color: white;
}
</style>
