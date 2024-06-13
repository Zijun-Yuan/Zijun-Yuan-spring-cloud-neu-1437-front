<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">登录</h2>
      <el-form :model="loginForm" label-width="100px">
        <el-form-item label="登录编码" prop="adminCode">
          <el-input v-model="loginForm.adminCode.value" autocomplete="on" placeholder="administrator" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="loginForm.password.value" autocomplete="on" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/adminStore';
import { adminLogin } from '@/api/admin';

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter();
    const adminStore = useAdminStore();
    const loginForm = ref({
      adminCode: '',
      password: '',
    });

    const handleLogin = async () => {
      try {
        const form = loginForm.value;
        const response = await adminLogin(form);
        if (response.data.code === 0) {
          adminStore.setToken(response.data.data.token);
          router.push('/admin/dashboard');
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    return {
      loginForm,
      handleLogin,
    };
  },
};
</script>

<style scoped>
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
