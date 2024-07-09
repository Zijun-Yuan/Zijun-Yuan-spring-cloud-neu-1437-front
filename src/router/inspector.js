import InspectorLogin from '../pages/inspector/InspectorLogin.vue';
import InspectorBoard from '../pages/inspector/InspectorBoard.vue';

const inspectorRoutes = [
    {path: '/inspector/login', component: InspectorLogin}
    , {path: '/inspector/board', component: InspectorBoard}
];

export default inspectorRoutes;
