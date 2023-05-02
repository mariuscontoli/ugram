import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      {
        path: '/profile/:id',
        component: () => import('src/pages/ProfilePage.vue'),
      },
      { path: '/search', component: () => import('src/pages/SearchPage.vue') },
      { path: '/searchUsers', component: () => import('src/pages/SearchUsersPage.vue') },
      { path: '/conversations', component: () => import('src/pages/ConversationList.vue') },
      { path: '/conversation/:id', name:'conversation', props: true, component: () => import('src/pages/PrivateConversation.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      { path: '/login', component: () => import('src/pages/LoginPage.vue') },
      { path: '/register', component: () => import('src/pages/RegisterPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
