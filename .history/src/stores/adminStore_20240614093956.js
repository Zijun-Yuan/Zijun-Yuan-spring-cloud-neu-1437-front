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
    getToken() {
      return state.token;
    },
    logout() {
      this.token = '';
    },
    logout() {
      this.token = '';
    },
    logout() {
      this.token = '';
    },
  }
});
