// src/stores/adminStore.js
import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: '',
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    logout() {
      this.token = '';
    }
  }
});
