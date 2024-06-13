// src/stores/adminStore.js
import { defineStore } from 'pinia';
import { adminLogin } from '@/api/admin';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: '',
    adminCode: '',
    password: ''
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setAdminCode(adminCode) {
      this.adminCode = adminCode;
    },
    setPassword(password) {
      this.password = password;
    },
    logout() {
      this.token = '';
      this.adminCode = '';
      this.password = '';
    }
  }
});
