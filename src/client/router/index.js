import { createRouter, createWebHistory } from 'vue-router';
import ClientLayout from '../layouts/ClientLayout.vue';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import NewsView from '../views/NewsView.vue';

const routes = [
  {
    path: '/',
    component: ClientLayout,
    meta: { requiresAuth: true, breadcrumb: 'PAGE.CLIENT' },
    children: [
      { path: '', name: 'HomeView', component: HomeView, meta: { breadcrumb: 'PAGE.CLIENT.HOME' }},
      { path: '/about', name: 'AboutView', component: AboutView, meta: { breadcrumb: 'PAGE.CLIENT.ABOUT' }},
      { path: '/news', name: 'NewsView', component: NewsView, meta: { breadcrumb: 'PAGE.CLIENT.NEWS' }},
      { path: '/login', name: 'LoginView',
        component: () => import('../views/LoginView.vue'), // Динамический импорт
        meta: { breadcrumb: 'PAGE.CLIENT.LOGIN' }
      },
      //{
        //path: '/news/:id', name: 'News', component: NewsView,
      //}
    ],
  },
];

const router = createRouter({
  history: createWebHistory('/'), // Базовый путь
  routes,
});

export default router;
