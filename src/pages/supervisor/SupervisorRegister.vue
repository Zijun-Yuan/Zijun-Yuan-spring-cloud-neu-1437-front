<template>
  <div class="register-container">
    <el-form :model="registerForm" :rules="rules" ref="formRef" label-width="100px">
      <el-button type="default" @click="goToLogin">返回登录</el-button>
      <el-form-item label="手机号" prop="telId">
        <el-input v-model="registerForm.telId"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="registerForm.realName"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="registerForm.age"></el-input>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="registerForm.birthday"
            :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="registerForm.sex">
          <el-radio value=1>男</el-radio>
          <el-radio value=0>女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="registerForm.confirmPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">注册</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useSupervisorStore} from "@/stores/supervisorStore";
import {ElMessage} from "element-plus";

export default {
  name: 'SupervisorRegister',
  setup: function () {
    const router = useRouter();
    const supervisorStore = useSupervisorStore();
    const registerForm = ref({
      telId: '',
      realName: '',
      age: '',
      birthday: null,
      sex: '',
      password: '',
      confirmPassword: '',
      isdel: 0,
    });
    const formRef = ref(null);
    const confirmPasswordValidator = (rule, value, callback) => {
      if (value !== registerForm.value.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    const rules = {
      telId: [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        {pattern: /\d{11}/, message: '手机号格式不正确', trigger: 'blur'}
      ],
      realName: [
        {required: true, message: '请输入真实姓名', trigger: 'blur'}
      ],
      age: [
        {required: true, message: '请输入年龄', trigger: 'blur'}
      ],
      birthday: [
        {required: true, message: '请选择出生日期', trigger: 'change'}
      ],
      sex: [
        {required: true, message: '请选择性别', trigger: 'change'}
      ],
      password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
        {min: 6, max: 16, message: '密码长度请在6到16个字符', trigger: 'blur'}
      ],
      confirmPassword: [
        {required: true, message: '请再次输入密码', trigger: 'blur'},
        {validator: confirmPasswordValidator, trigger: 'blur'}
      ]
    };

    const pickerOptions = {
      disabledDate(time) {
        return time.getTime() > Date.now();
      }
    };

    const goToLogin = () => {
      router.push('/supervisor/login');
    }

    const handleSubmit = async () => {
      if (formRef.value) { // Use formRef to access the form
        formRef.value.validate(async (valid) => {
          if (valid) {
            await supervisorStore.supervisorRegister(registerForm.value);
            if (supervisorStore.register === registerForm.value.telId){
              ElMessage.success('注册成功，请登录');
              await router.push('/supervisor/login');
            }else {
              registerForm.value.telId = '';
              ElMessage.error('该手机号已被注册');
            }
            // const response = await supervisorRegister(registerForm.value);
            // if (response.data.code === 0) {
            //   console.log('Register successful, response data:', response.data);
            //   await router.push('/supervisor/login');
            // } else {
            //   console.log('Register failed, response data:', response.data);
            //   registerForm.value.telId = '';  // 清空账号名输入框
            //   ElMessage.error('该手机号已被注册');
            // }
          } else {
            console.log('error submit!!');
            ElMessage.error('请填写正确的注册信息');
          }
        });
      }
    };

    return {
      registerForm,
      formRef,
      rules,
      pickerOptions,
      handleSubmit,
      goToLogin,
      confirmPasswordValidator,
    };
  },
};
</script>

<style scoped>
/* 样式可以根据需要自行调整 */
.register-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>