<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">网格员登录</h2>
      <el-form :model="inspectorLoginForm" label-width="100px">
        <el-form-item label="登录编码" prop="inspectorCode">
          <el-input v-model="inspectorLoginForm.inspectorCode" placeholder="请输入网格员账号" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="inspectorLoginForm.password" show-password />
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
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/inspector';

export default {
  name: 'InspectorLogin',
  setup() {
    const router = useRouter();
    const inspectorLoginForm = ref({
      inspectorCode: '',
      password: '',
    });

    const errorMessage = ref('');

    const Login = async () => {
      try {
        const data = {
          inspectorCode: inspectorLoginForm.value.inspectorCode,
          password: inspectorLoginForm.value.password,
        };
        console.log('Form Data:', data);

        const response = await login(data)
        console.log('Response:', response);

        if (response.data.code === 0) {
          console.log('Login successful, response data:', response.data);

          // 假设登录成功时，响应数据包含token
          // 存储token，可以使用Pinia或者localStorage
          // 这里假设有个方法adminStore.setToken()
          // adminStore.setToken(response.data.data.token);

          router.push('/inspector/main');
        } else {
          console.log('Login failed, response data:', response.data);
          errorMessage.value = response.data.message;
        }
      } catch (error) {
        console.error('Error during login:', error);
        errorMessage.value = '登录失败，请检查您的登录编码和密码。';
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