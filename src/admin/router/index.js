import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

import NewsLayout from '../layouts/NewsLayout.vue';
import NewsList from '../views/News/List.vue';
import NewsCreate from '../views/News/Create.vue';
import NewsShow from '../views/News/Show.vue';
import NewsEdit from '../views/News/Edit.vue';

import { getUser } from '@/client/api/auth'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/news',
    component: NewsLayout,
    meta: { requiresAuth: true },
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

//Навигационная защита
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    if (!token) {
      return window.location.href = '/login'
    }

    try {
      await getUser() // проверка токена через /auth/me
      next()
    } catch (error) {
      localStorage.removeItem('token')
      return window.location.href = '/login'
    }
  } else {
    next()
  }
})

export default router;
