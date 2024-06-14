// src/stores/adminStore.js
import { defineStore } from 'pinia';

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
