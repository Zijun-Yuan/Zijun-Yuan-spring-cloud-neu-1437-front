import SupervisorLogin from '../pages/supervisor/SupervisorLogin.vue';
import SupervisorRegister from "../pages/supervisor/SupervisorRegister.vue";
import SupervisorBoard from "@/pages/supervisor/SupervisorBoard.vue";

const supervisorRoutes = [
    {path: '/supervisor/login', component: SupervisorLogin ,meta: {userType: 'supervisor'}},
    {path: '/supervisor/register', component: SupervisorRegister,meta: {userType:'supervisor'}},
    {path: '/supervisor/main', component: SupervisorBoard,meta: {userType:'supervisor'}},
];

export default supervisorRoutes;
