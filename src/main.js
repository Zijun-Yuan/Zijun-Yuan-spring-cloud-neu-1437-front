import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {useSupervisorStore} from "@/stores/supervisorStore";


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 在应用启动时重新设置 Axios 的请求拦截器
const supervisorStore = useSupervisorStore();
if (supervisorStore.token) {
  supervisorStore.setToken(supervisorStore.token);
}

app.mount('#app');
