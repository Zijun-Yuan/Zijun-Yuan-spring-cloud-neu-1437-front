<template>
  <div class="login-container">
    <div class="left-section">
      <!-- 左边的图片 -->
      <img :src="require('@/assets/images/SupervisorLogin.jpg')" alt="SupervisorLogin" class="login-image"/>
    </div>
    <div class="right-section">
      <!-- 右边的登录输入栏 -->
      <el-form class="login-form" :model="loginForm">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.telId" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="handleRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {supervisorLogin} from "@/api/supervisor";
import {useSupervisorStore} from "@/stores/supervisorStore";
import {ElMessage} from "element-plus";
import supervisor from "@/router/supervisor";

export default {
  name: 'SupervisorLogin',
  setup() {
    const router = useRouter();
    const supervisorState  = useSupervisorStore();
    const loginForm = ref({
      telId: '',
      password: '',
    });
    const errorMessage = ref('');

    const handleLogin = async () => {
      // try {
      //   const data = {
      //     supervisorCode: loginForm.value.telId,
      //     password: loginForm.value.password,
      //   };
      //   const response = await supervisorLogin(data);
      //   if (response.data.code === 0) {
      //     console.log('Login successful, response data:', response.data);
      //     await router.push('/admin/main');
      //   } else {
      //     console.log('Login failed, response data:', response.data);
      //     ElMessage.error('账号或密码不正确，请重试');
      //     loginForm.value.password = '';  // 清空密码输入框
      //     errorMessage.value = response.data.message;
      //   }
      // } catch (error) {
      //   console.error('Error during login:', error);
      //   errorMessage.value = '登录失败，请检查您的登录编码和密码。';
      // }

      const data = {
        supervisorCode: loginForm.value.telId,
        password: loginForm.value.password,
      };
      await supervisorState.supervisorLogin(data);
      if (supervisorState.supervisorCode === data.supervisorCode){
        await router.push('/supervisor/main');
      }else {
        ElMessage.error('账号或密码不正确，请重试');
        loginForm.value.password = '';  // 清空密码输入框
      }
    };
    const handleRegister = () => {
      router.push('/supervisor/register');
    };
    return {
      loginForm,
      handleLogin,
      errorMessage,
      handleRegister,
    };
  },
};
</script>

<style>
/* 样式可以根据需要自行调整 */
.login-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
}

.login-image {
  max-width: 500px;
  max-height: 500px;
  border-radius: 50%; /* 将左侧图片变为圆形 */
}

.right-section {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}

.login-form {
  max-width: 300px;
  margin: 0 auto;
}
</style>
