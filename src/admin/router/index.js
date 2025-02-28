import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import NewsView from '../views/NewsView.vue';

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/news', name: 'news', component: NewsView },
];

const router = createRouter({
  history: createWebHistory('/admin'), // Базовый путь
  routes,
});

export default router;
