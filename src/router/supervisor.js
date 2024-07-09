import SupervisorLogin from '../pages/supervisor/SupervisorLogin.vue';
import SupervisorRegister from "../pages/supervisor/SupervisorRegister.vue";
import SupervisorBoard from "@/pages/supervisor/SupervisorBoard.vue";

const supervisorRoutes = [
    {path: '/supervisor/login', component: SupervisorLogin },
    {path: '/supervisor/register', component: SupervisorRegister},
    {path: '/supervisor/main', component: SupervisorBoard},
];

export default supervisorRoutes;
