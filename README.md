你需要先：
npm install vue@next vue-router@next pinia element-plus
npm install --save-dev @babel/core @babel/preset-env babel-eslint babel-loader vue-loader
为了设计一个使用Pinia、Axios和Element UI开发的前端项目，并且不同用户（admin、supervisor、inspector）的页面分开存储，建议采用以下项目结构。这个结构可以确保代码的模块化、可维护性和可扩展性。

### 项目结构

```
Neutraining/
│
├── public/
│   ├── index.html
│   └── ...
│
├── src/
│   ├── api/
│   │   ├── admin.js
│   │   ├── supervisor.js
│   │   ├── inspector.js
│   │   └── axios.js
│   │
│   ├── assets/
│   │   └── ...
│   │
│   ├── components/
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.vue
│   │   │   ├── AdminLogin.vue
│   │   │   └── ...
│   │   │
│   │   ├── supervisor/
│   │   │   ├── SupervisorDashboard.vue
│   │   │   ├── SupervisorLogin.vue
│   │   │   └── ...
│   │   │
│   │   ├── inspector/
│   │   │   ├── InspectorDashboard.vue
│   │   │   ├── InspectorLogin.vue
│   │   │   └── ...
│   │
│   ├── router/
│   │   ├── index.js
│   │   ├── admin.js
│   │   ├── supervisor.js
│   │   ├── inspector.js
│   │   └── ...
│   │
│   ├── stores/
│   │   ├── adminStore.js
│   │   ├── supervisorStore.js
│   │   ├── inspectorStore.js
│   │   └── ...
│   │
│   ├── App.vue
│   ├── main.js
│   └── ...
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── ...
```

### 详细说明

1. **`public/`**: 存放静态文件和`index.html`。
2. **`src/`**: 项目的主要源代码目录。
   - **`api/`**: 存放所有与API交互相关的代码。包括各个用户（admin、supervisor、inspector）的API请求文件和通用的Axios实例配置。
     - `axios.js`: 配置Axios实例。
     - `admin.js`: admin用户的API请求。
     - `supervisor.js`: supervisor用户的API请求。
     - `inspector.js`: inspector用户的API请求。
   - **`assets/`**: 存放项目中的静态资源，如图片、样式文件等。
   - **`components/`**: 存放项目中的通用组件。
   - **`pages/`**: 存放各个用户的页面，每个用户有一个单独的文件夹。
     - `admin/`: 存放admin用户的页面。
     - `supervisor/`: 存放supervisor用户的页面。
     - `inspector/`: 存放inspector用户的页面。
   - **`router/`**: 存放路由配置文件。
     - `index.js`: 主路由配置文件。
     - `admin.js`: admin用户的路由配置。
     - `supervisor.js`: supervisor用户的路由配置。
     - `inspector.js`: inspector用户的路由配置。
   - **`stores/`**: 存放Pinia状态管理相关的文件。
     - `adminStore.js`: admin用户的状态管理。
     - `supervisorStore.js`: supervisor用户的状态管理。
     - `inspectorStore.js`: inspector用户的状态管理。
   - **`App.vue`**: 主应用组件。
   - **`main.js`**: 应用入口文件。

### 示例代码

#### `api/axios.js`

```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  config => {
    // Add token or other request configurations here
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default instance;
```

#### `api/admin.js`

```javascript
import axios from './axios';

export function adminLogin(data) {
  return axios.post('/admin/login', data);
}

// Add other admin API requests here
```

#### `stores/adminStore.js`

```javascript
import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: '',
    adminInfo: {},
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setAdminInfo(info) {
      this.adminInfo = info;
    },
  },
});
```

#### `router/admin.js`

```javascript
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
```

#### `main.js`

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
```

#### `router/index.js`

```javascript
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
```

这种项目结构可以确保各个用户端的页面和逻辑分离，便于维护和扩展。你可以根据实际需求进一步调整和完善。