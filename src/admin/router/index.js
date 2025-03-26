import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

import NewsList from '../views/News/List.vue';
import NewsCreate from '../views/News/Create.vue';
import NewsShow from '../views/News/Show.vue';
import NewsEdit from '../views/News/Edit.vue';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/news',
    name: 'news',
    children: [
      { path: '', name: 'NewsList', component: NewsList},
      { path: 'create', name: 'NewsCreate', component: NewsCreate},
      { path: 'show/:id', name: 'NewsShow', component: NewsShow},
      { path: 'edit/:id', name: 'NewsEdit', component: NewsEdit},
    ],
  },
];

const router = createRouter({
  history: createWebHistory('/admin'), // Базовый путь
  routes,
});

export default router;
