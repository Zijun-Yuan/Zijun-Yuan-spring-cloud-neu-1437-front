import SupervisorLogin from '../pages/supervisor/SupervisorLogin.vue';
import SupervisorRegister from "../pages/supervisor/SupervisorRegister.vue";

const supervisorRoutes = [
  { path: '/supervisor/login', component: SupervisorLogin },
  { path: '/supervisor/register', component: SupervisorRegister },
];

export default supervisorRoutes;
