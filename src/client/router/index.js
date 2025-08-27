import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'), // Динамический импорт
  },
];

const router = createRouter({
  history: createWebHistory('/'), // Базовый путь
  routes,
});

export default router;
