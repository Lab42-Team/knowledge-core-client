import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

import KnowledgeCoreLayout from '../layouts/KnowledgeCoreLayout.vue';
import KnowledgeCoreShow from '../views/KnowledgeCore/Show.vue';
import KnowledgeCoreEdit from '../views/KnowledgeCore/Edit.vue';
import KnowledgeCoreEditDescription from '../views/KnowledgeCore/EditDescription.vue';
import KnowledgeCoreEditReferences from '../views/KnowledgeCore/EditReferences.vue';

import NewsLayout from '../layouts/NewsLayout.vue';
import NewsList from '../views/News/List.vue';
import NewsCreate from '../views/News/Create.vue';
import NewsShow from '../views/News/Show.vue';
import NewsEdit from '../views/News/Edit.vue';

import DevelopmentsLayout from '../layouts/DevelopmentsLayout.vue';
import DevelopmentsList from '../views/Developments/List.vue';
import DevelopmentsCreate from '../views/Developments/Create.vue';
import DevelopmentsShow from '../views/Developments/Show.vue';
import DevelopmentsEdit from '../views/Developments/Edit.vue';

import ProjectLayout from '../layouts/ProjectLayout.vue';
import ProjectList from '../views/Project/List.vue';
import ProjectCreate from '../views/Project/Create.vue';
import ProjectShow from '../views/Project/Show.vue';
import ProjectEdit from '../views/Project/Edit.vue';
import ProjectTeam from '../views/Project/Team.vue';
import ProjectEditTeam from '../views/Project/EditTeam.vue';
import ProjectShowUser from '../views/Project/ShowUser.vue';

import UserLayout from '../layouts/UserLayout.vue';
import UserList from '../views/User/List.vue';
import UserCreate from '../views/User/Create.vue';
import UserShow from '../views/User/Show.vue';
import UserEdit from '../views/User/Edit.vue';
import UserEditPassword from '../views/User/EditPassword.vue';

import { getUser } from '@/client/api/auth'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true},
  },
  {
    path: '/news',
    component: NewsLayout,
    meta: { requiresAuth: true, breadcrumb: 'PAGE.NEWS.NAME' },
    children: [
      { path: '', name: 'NewsList', component: NewsList, meta: { breadcrumb: 'PAGE.NEWS.NAME' }},
      { path: 'create', name: 'NewsCreate', component: NewsCreate, meta: { breadcrumb: 'PAGE.NEWS.CREATE' }},
      { path: 'show/:id', name: 'NewsShow', component: NewsShow, meta: { breadcrumb: 'PAGE.NEWS.VIEW' }},
      { path: 'edit/:id', name: 'NewsEdit', component: NewsEdit, meta: { breadcrumb: 'PAGE.NEWS.EDIT' }},
    ],
  },
  {
    path: '/knowledge-core',
    component: KnowledgeCoreLayout,
    meta: { requiresAuth: true, breadcrumb: 'PAGE.KNOWLEDGE_CORE.NAME' },
    children: [
      { path: '', name: 'KnowledgeCoreShow', component: KnowledgeCoreShow, meta: { breadcrumb: 'PAGE.KNOWLEDGE_CORE.NAME' }},
      { path: 'edit', name: 'KnowledgeCoreEdit', component: KnowledgeCoreEdit, meta: { breadcrumb: 'PAGE.KNOWLEDGE_CORE.EDIT' }},
      { path: 'editDescription', name: 'KnowledgeCoreEditDescription', component: KnowledgeCoreEditDescription, meta: { breadcrumb: 'PAGE.KNOWLEDGE_CORE.EDIT_DESCRIPTION' }},
      { path: 'editReferences', name: 'KnowledgeCoreEditReferences', component: KnowledgeCoreEditReferences, meta: { breadcrumb: 'PAGE.KNOWLEDGE_CORE.EDIT_REFERENCES' }},
    ],
  },
  {
    path: '/developments',
    component: DevelopmentsLayout,
    meta: { requiresAuth: true, breadcrumb: 'PAGE.DEVELOPMENTS.NAME' },
    children: [
      { path: '', name: 'DevelopmentsList', component: DevelopmentsList, meta: { breadcrumb: 'PAGE.DEVELOPMENTS.NAME' }},
      { path: 'create', name: 'DevelopmentsCreate', component: DevelopmentsCreate, meta: { breadcrumb: 'PAGE.DEVELOPMENTS.CREATE' }},
      { path: 'show/:id', name: 'DevelopmentsShow', component: DevelopmentsShow, meta: { breadcrumb: 'PAGE.DEVELOPMENTS.VIEW' }},
      { path: 'edit/:id', name: 'DevelopmentsEdit', component: DevelopmentsEdit, meta: { breadcrumb: 'PAGE.DEVELOPMENTS.EDIT' }},
    ],
  },
  {
    path: '/project',
    component: ProjectLayout,
    meta: { requiresAuth: true, breadcrumb: 'PAGE.PROJECTS.NAME' },
    children: [
      { path: '', name: 'ProjectList', component: ProjectList, meta: { breadcrumb: 'PAGE.PROJECTS.NAME' }},
      { path: 'create', name: 'ProjectCreate', component: ProjectCreate, meta: { breadcrumb: 'PAGE.PROJECTS.CREATE' }},
      { path: 'show/:id', name: 'ProjectShow', component: ProjectShow, meta: { breadcrumb: 'PAGE.PROJECTS.VIEW' }},
      { path: 'edit/:id', name: 'ProjectEdit', component: ProjectEdit, meta: { breadcrumb: 'PAGE.PROJECTS.EDIT' }},
      {
        path: 'team/:id',
        name: 'ProjectTeam',
        component: ProjectTeam,
        meta: { breadcrumb: 'PAGE.PROJECTS.TEAM' },
        children: [
          { path: 'edit-team', name: 'ProjectEditTeam', component: ProjectEditTeam, meta: { breadcrumb: 'PAGE.PROJECTS.EDIT_TEAM' }},
          { path: 'user/:id_user', name: 'ProjectShowUser', component: ProjectShowUser, meta: { breadcrumb: 'PAGE.PROJECTS.VIEW_USER' }},
        ],
      },
    ],
  },
  {
    path: '/user',
    component: UserLayout,
    meta: { requiresAuth: true, breadcrumb: 'PAGE.USERS.NAME' },
    children: [
      { path: '', name: 'UserList', component: UserList, meta: { breadcrumb: 'PAGE.USERS.NAME' }},
      { path: 'create', name: 'UserCreate', component: UserCreate, meta: { breadcrumb: 'PAGE.USERS.CREATE' }},
      { path: 'show/:id', name: 'UserShow', component: UserShow, meta: { breadcrumb: 'PAGE.USERS.VIEW' }},
      { path: 'edit/:id', name: 'UserEdit', component: UserEdit, meta: { breadcrumb: 'PAGE.USERS.EDIT' }},
      { path: 'edit-password/:id', name: 'UserEditPassword', component: UserEditPassword, meta: { breadcrumb: 'PAGE.USERS.EDIT_PASSWORD' }},
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
  console.log('Проверка токена в роутере:', token);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    if (!token) {
      console.warn('Токен отсутствует, перенаправление на /login');
      return (window.location.href = '/login'); // Клиентский маршрут
    }

    try {
      await getUser();
      console.log('Пользователь аутентифицирован');
      next();
    } catch (error) {
      console.error('Ошибка проверки токена:', error);
      localStorage.removeItem('token');
      window.location.href = '/login'; // Клиентский маршрут
    }
  } else {
    next()
  }
})

export default router;
