<template>
	
  <div class="login-container">
	  <div class="left-section">
	    <!-- 左边的图片 -->
	    <img :src="require('@/assets/images/SupervisorLogin.jpg')" alt="SupervisorLogin" class="login-image" />
	  </div>
	  <div class="right-section">
	    <!-- 右边的登录输入栏 -->
	    <el-card class="login-card">
	      <h2 class="login-title">网格员登录</h2>
	      <el-form :model="inspectorLoginForm" label-width="100px">
	        <el-form-item label="账号" prop="inspectorCode">
	          <el-input v-model="inspectorLoginForm.inspectorCode" placeholder="请输入网格员账号" />
	        </el-form-item>
	        <el-form-item label="密码" prop="password">
	          <el-input type="password" v-model="inspectorLoginForm.password" placeholder="请输入网格员密码" show-password />
	        </el-form-item>
	        <el-form-item>
	          <el-button type="primary" @click="Login">登录</el-button>
	        </el-form-item>
	        <el-form-item v-if="errorMessage">
	          <el-alert type="error" :closable="false" title="登录失败" :description="errorMessage" />
	        </el-form-item>
	      </el-form>
	    </el-card>
	  </div>
    
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/inspector';
import {useInspectorStore} from "@/stores/inspectorStore";
import {ElMessage} from "element-plus";

export default {
  name: 'InspectorLogin',
  setup() {
    // 路由跳转
    const router = useRouter();
    // 状态管理
    const inspectorStore = useInspectorStore();
    // 登录的表单数据
    const inspectorLoginForm = ref({
      inspectorCode: '',
      password: '',
    });
    const errorMessage = ref('');
	

    // 登录方法
    const Login = async () => {
      const data = {
        inspectorCode: inspectorLoginForm.value.inspectorCode,
        password: inspectorLoginForm.value.password,
      };
      await inspectorStore.inspectorLogin(data);
      if (inspectorStore.inspectorCode === data.inspectorCode) {
        ElMessage.success('登录成功');
        await router.push('/inspector/board');
      } else {
        ElMessage.error('账号或密码不正确，请重试');
        inspectorLoginForm.value.password = '';  // 清空密码输入框
      }
    };

    return {
      inspectorLoginForm,
      Login,
      errorMessage,
    };
  },
}
</script>

<style>
/* 样式可以根据需要自行调整 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
.login-card {
  width: 400px;
  padding: 20px;
}
.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>