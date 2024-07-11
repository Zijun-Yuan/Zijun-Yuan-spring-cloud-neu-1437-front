<template>
	<div class="login-container">
	  <div class="left-section">
	    <!-- 左边的图片 -->
	    <img :src="require('@/assets/images/SupervisorLogin.jpg')" alt="SupervisorLogin" class="login-image" />
	  </div>
	  <div class="right-section">
	    <!-- 右边的登录输入栏 -->
	    <div class="register-header" style="text-align:center;">
	      <h3>管理员登录</h3>
	    </div>
	    <el-form class="login-form" :model="loginForm">
	      <el-form-item label="账号" prop="adminCode">
	        <el-input v-model="loginForm.adminCode" placeholder="请输入登录编码"></el-input>
	      </el-form-item>
	      <el-form-item label="密码" prop="password">
	        <el-input type="password" v-model="loginForm.password" placeholder="请输入登录密码"></el-input>
	      </el-form-item>
	      <div style="display: flex; justify-content: center;">
	        <el-form-item>
	          <el-button type="primary" @click="handleLogin">登录</el-button>
	        </el-form-item>
	      </div>
		  <el-form-item v-if="errorMessage">
		  	<el-alert type="error" :closable="false" :description="errorMessage" />
		  </el-form-item>
	    </el-form>
	  </div>
	</div>
<!-- 	
	<div class="login-container">
		<el-card class="login-card">
			<h2 class="login-title">登录</h2>
			<el-form :model="loginForm" label-width="100px">
				<el-form-item label="登录编码" prop="adminCode">
					<el-input v-model="loginForm.adminCode" placeholder="administrator" />
				</el-form-item>
				<el-form-item label="登录密码" prop="password">
					<el-input type="password" v-model="loginForm.password" show-password />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleLogin">登录</el-button>
				</el-form-item>
				<el-form-item v-if="errorMessage">
					<el-alert type="error" :closable="false" :description="errorMessage" />
				</el-form-item>
			</el-form>
		</el-card>
	</div> -->
</template>

<script>
	import {
		ref
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import {
		adminLogin
	} from '@/api/admin';
	import {
		useAdminStore
	} from '@/stores/adminStore.js';
	export default {
		name: 'AdminLogin',
		setup() {
			const adminStore = useAdminStore();
			const router = useRouter();
			const loginForm = ref({
				adminCode: '',
				password: '',
			});
			const errorMessage = ref('');

			const handleLogin = async () => {
				try {
					const data = {
						adminCode: loginForm.value.adminCode,
						password: loginForm.value.password,
					};
					console.log('Form Data:', data);

					const response = await adminLogin(data);
					console.log('Response:', response);

					if (response.data.code === 0) {
						console.log('Login successful, response data:', response.data);
						// 假设登录成功时，响应数据包含token
						// 存储token，可以使用Pinia或者localStorage
						// adminStore.setToken(response.data.data);
						localStorage.setItem('admin-token', response.data.data);
						// console.log('Token stored:', adminStore.token);
						router.push('/admin/main');
					} else {
						console.log('Login failed, response data:', response.data);
						errorMessage.value = response.data.message;
					}
				} catch (error) {
					console.error('Error during login:', error);
					errorMessage.value = '登录失败，请检查您的账号和密码。';
				}
			};

			return {
				loginForm,
				handleLogin,
				errorMessage,
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