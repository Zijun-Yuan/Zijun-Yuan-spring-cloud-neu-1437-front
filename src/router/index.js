import {createRouter, createWebHistory} from 'vue-router';
import adminRoutes from './admin';
import supervisorRoutes from './supervisor';
import inspectorRoutes from './inspector';
import dataRoutes from './data';

const routes = [
    ...adminRoutes,
    ...supervisorRoutes,
    ...inspectorRoutes,
    ...dataRoutes
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
