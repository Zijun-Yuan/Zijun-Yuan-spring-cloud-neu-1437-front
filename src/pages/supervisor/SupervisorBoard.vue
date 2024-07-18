<template>
  <el-backtop :right="100" :bottom="100"/>
  <div class="common-layout">
    <el-container class="full-height">
      <el-header class="header">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="12">
            <h1 class="mb-2 title">公众监督员工作台</h1>
          </el-col>
          <el-col :span="12" class="user-info" style="text-align: right;">
            <span class="welcome-message">欢迎您，{{ supervisorStore.supervisor.realName }}监督员</span>
            <el-button type="danger" @click="logout" class="logout-button">退出登录</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <!-- 左侧菜单栏 -->
        <el-aside width="220px" class="menu-aside full-height">
          <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" @select="handleSelect">
            <el-menu-item index="1-1">
              <el-icon>
                <location/>
              </el-icon>
              <span>历史反馈信息列表</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <el-icon>
                <document/>
              </el-icon>
              <span>上报网格信息</span>
            </el-menu-item>
            <el-menu-item index="1-3">
              <el-icon>
                <setting/>
              </el-icon>
              <span>浏览个人信息</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <div v-if="currentTable === ''" class="table-container">
            <img src="@/assets/images/SupervisorLogin.jpg" alt="Placeholder Image" class="placeholder-image"/>
          </div>

          <!-- 历史反馈信息列表 -->
          <div v-if="currentTable === 'feedbackList'" class="table-container">
            <el-table :data="currentPageInfoList" :header-cell-style="{textAlign: 'center'}" border height="590" stripe
                      style="width: 100%">
              <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="55"
                               class-name="align-middle">
                <template #header>
                  <span @click="sortDescending" style="cursor: pointer;">序号</span>
                </template>
              </el-table-column>
              <el-table-column label="污染等级" align="center" width="100">
                <template #default="{ row }">
                  <div v-if="row.aqiLevel !== undefined && row.aqiLevel !== null"
                       class="aqi-box"
                       :style="{ background: getAQIDetail(row.aqiLevel)?.color }">
                    <span>{{ getAQIDetail(row.aqiLevel)?.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="反馈日期" align="center" width="150"></el-table-column>
              <el-table-column prop="time" label="反馈时间" align="center" width="150"></el-table-column>
              <el-table-column prop="province.provinceName" label="省份" align="center" width="100"></el-table-column>
              <el-table-column prop="city.cityName" label="城市" align="center" width="100"></el-table-column>
              <el-table-column prop="address" label="具体位置" align="center" width="200"></el-table-column>
              <el-table-column prop="feedback" label="描述" align="center" width="350"></el-table-column>
            </el-table>

            <el-pagination v-if="currentInfoList.length > pageSize" :current-page="currentInfoPage"
                           :page-size="pageSize" layout="total, prev, pager, next" :total="currentInfoList.length"
                           @current-change="handleCurrentInfoListChange" class="pagination-container"/>
          </div>


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
              <el-col :span="12">
                <el-form-item label="地址">
                  <el-input v-model="reportForm.address" placeholder="填写具体地址" style="width: 100%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="空气质量等级">
              <el-table :data="aqiLevelDescriptions" border style="width: 100%">
                <el-table-column prop="level" label="等级" width="100"></el-table-column>
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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useSupervisorStore} from '@/stores/supervisorStore';
import {useLocationStore} from "@/stores/locationStore";
import {useAQIStore} from "@/stores/aqiLevelStore";
import {Location, Message, Document, Setting} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";
import {ElMessageBox} from "element-plus/lib/components";

export default {
  name: 'SupervisorBoard',
  components: {
    Message,
    Location,
    Document,
    Setting,
  },
  setup() {
    const router = useRouter();
    const supervisorStore = useSupervisorStore();
    const locationStore = useLocationStore();
    const aqiLevelStore = useAQIStore();
    const defaultActive = ref('1-1');
    let currentTable = ref('');
    let currentInfoList = ref([]);
    let provinces = ref([]);
    let cities = ref([]);
    let pageSize = ref(10);
    let currentInfoPage = ref(1);

    const currentPageInfoList = computed(() => {
      const start = (currentInfoPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return currentInfoList.value.slice(start, end);
    });

    const getAQIDetail = (level) => {
      const aqiDetails = {
        1: {name: '优', color: '#00E400'},
        2: {name: '良', color: '#FFFF00'},
        3: {name: '轻度污染', color: '#FF7E00'},
        4: {name: '中度污染', color: '#FF0000'},
        5: {name: '重度污染', color: '#99004C'},
        6: {name: '严重污染', color: '#7E0023'},
      };
      return aqiDetails[level] || {name: '未知', color: '#FFFFFF'};
    };


    const handleCurrentInfoListChange = (page) => {
      currentInfoPage.value = page;
    };

    const indexMethod = (index) => {
      return (currentInfoPage.value - 1) * pageSize.value + index + 1;
    };

    const sortDescending = () => {
      currentInfoList.value = [...currentInfoList.value].reverse();
    };

    const reportForm = ref({
      province: '',
      city: '',
      address: '',
      aqiLevel: '',
      feedback: '',
    });

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
      {level: '六', quality: '严重污染', description: '健康人群运动耐受力降低，有明显强烈症状，提前出现某些疾病'},
    ];

    const personalInfo = ref({
      realName: '',
      sex: '',
      birthday: '',
      telId: '',
    });

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
    };

    const getFeedbackList = async () => {
      try {
        await supervisorStore.supervisorFeedbackList();
        currentTable.value = 'feedbackList';
        await processFeedbackList();
      } catch (error) {
        console.log(error);
      }
    };

    const processFeedbackList = async () => {
      currentInfoList.value = []; // 重置数组
      let date = new Date();
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
        // info.aqiLevel = aqiInfo.name + "(" + aqiInfo.level + ")";
        info.aqiLevel = supervisorStore.feedbackList[i].aqiLevel;
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
    };

    const reportGridInformation = () => {
      currentTable.value = 'reportGridInformation';
    };

    const submitReport = async () => {
      if (!reportForm.value.province || !reportForm.value.city || !reportForm.value.address || !reportForm.value.aqiLevel || !reportForm.value.feedback) {
        ElMessage.warning('请填写完整信息');
        return;
      }
      const reportData = {
        status: 1,
        aqiLevel: reportForm.value.aqiLevel,
        cityCode: reportForm.value.city,
        address: reportForm.value.address,
        feedback: reportForm.value.feedback,
        timeSupervisor: new Date().toISOString().slice(0, 19),
        supervisorName: supervisorStore.supervisor.realName
      };
      if (await supervisorStore.addFeedback(reportData)) {
        ElMessage.success('信息上传成功，感谢您的反馈！');
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
        ElMessage.error('反馈信息失败，请稍后再试！');
      }
    };

    const browsePersonalInfo = () => {
      personalInfo.value.realName = supervisorStore.supervisor.realName;
      personalInfo.value.sex = (supervisorStore.supervisor.sex === 1 ? "男" : "女");
      personalInfo.value.birthday = supervisorStore.supervisor.birthday;
      personalInfo.value.telId = supervisorStore.supervisor.telId;
      currentTable.value = 'browsePersonalInfoTable';
    };

    const updatePersonalInfo = async () => {
      if (!personalInfo.value.realName || !personalInfo.value.birthday || !personalInfo.value.telId) {
        ElMessage.warning('有为空的信息项，请填写完整');
      } else {
        if (await supervisorStore.updateSupervisor(personalInfo.value)) {
          ElMessage.success('个人信息更新成功！');
        } else {
          ElMessage.error('该电话号码已被注册，请更换电话号码！');
        }
      }
    };

    const handleProvinceChange = async (provinceId) => {
      if (provinceId) {
        cities.value = await locationStore.getCitiesByProvinceId(provinceId);
        reportForm.value.city = '';
      } else {
        cities.value = [];
        reportForm.value.city = '';
      }
    };

    const handleSelect = (index) => {
      if (index === '1-1') {
        getFeedbackList();
      } else if (index === '1-2') {
        reportGridInformation();
      } else if (index === '1-3') {
        browsePersonalInfo();
      }
    };

    onMounted(async () => {
      provinces.value = await locationStore.getAllProvinces();
      const token = localStorage.getItem('supervisor-token');
      if (token) {
        supervisorStore.setToken(token);
      }
    });

    return {
      supervisorStore,
      currentTable,
      currentInfoList,
      getFeedbackList,
      processFeedbackList,
      reportGridInformation,
      browsePersonalInfo,
      updatePersonalInfo,
      reportForm,
      personalInfo,
      aqiLevelDescriptions,
      defaultActive,
      sortDescending,
      submitReport,
      handleProvinceChange,
      handleSelect,
      currentPageInfoList,
      handleCurrentInfoListChange,
      pageSize,
      currentInfoPage,
      indexMethod,
      provinces,
      cities,
      logout,
      getAQIDetail,
    };
  },
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}

.common-layout {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.header {
  background-color: #409EFF;
  color: white;
  padding: 10px;
}

.title {
  margin: 0;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.welcome-message {
  margin-right: 20px;
  color: white;
}

.logout-button {
  margin-left: 20px;
}

.menu-aside .el-menu {
  height: 100%;
}

.menu-aside {
  background-color: #20232A;
}

.table-container {
  margin-top: 0;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
}

.placeholder-image {
  width: 100%;
  border-radius: 8px;
}

.el-table th {
  background-color: #f2f6fc;
  color: #606266;
  font-weight: bold;
}

.el-table td {
  padding: 12px 8px;
}

.mb-2 {
  margin-bottom: 20px;
}

.custom-tag {
  background-color: #7777e3;
  border-color: #7777e3;
  color: white;
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

</style>
