import { createRouter, createWebHistory } from 'vue-router';
import AdminDashboard from '../pages/admin/AdminDashboard.vue';
import AdminLogin from '../pages/admin/AdminLogin.vue';

const routes = [
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard },
  // Add other admin routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
