import { createRouter, createWebHistory } from 'vue-router';
import adminRoutes from './admin';
import supervisorRoutes from './supervisor';
import inspectorRoutes from './inspector';

const routes = [
  ...adminRoutes,
  ...supervisorRoutes,
  ...inspectorRoutes,
  // Add other global routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
