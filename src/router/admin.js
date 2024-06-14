import AdminLogin from '../pages/admin/AdminLogin.vue';
import AdminBoard from '../pages/admin/AdminBoard.vue';

const adminRoutes = [
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/main', component: AdminBoard },
  // Add other admin routes here
];

export default adminRoutes;
