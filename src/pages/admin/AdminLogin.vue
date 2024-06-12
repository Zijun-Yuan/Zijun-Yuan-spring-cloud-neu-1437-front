<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">Admin Login</h2>
      <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="100px">
        <el-form-item label="Admin Code" prop="adminCode">
          <el-input v-model="loginForm.adminCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
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
    const rules = ref({
      adminCode: [
        { required: true, message: 'Please input admin code', trigger: 'blur' },
      ],
      password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
      ],
    });

    const handleLogin = () => {
      const form = loginForm.value;
      adminLogin(form)
        .then(response => {
          if (response.data.code === 0) {
            adminStore.setToken(response.data.data.token);
            router.push('/admin/dashboard');
          } else {
            console.error(response.data.message);
          }
        })
        .catch(error => {
          console.error(error);
        });
    };

    return {
      loginForm,
      rules,
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
