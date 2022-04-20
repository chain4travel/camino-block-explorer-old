import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'Ecosystem', path: 'ecosystem', component: () => import('pages/Ecosystem.vue'), meta: { showInMenu: true, icon: 'language ' } },
      { name: 'Bridge', path: 'bridge', component: () => import('pages/Ecosystem.vue'), meta: { showInMenu: true, icon: 'language ' } },
      { name: 'Wallet', path: 'wallet', component: () => import('pages/Ecosystem.vue'), meta: { showInMenu: true, icon: 'language ' } },
      { name: 'Explorer', path: 'explorer', component: () => import('pages/Ecosystem.vue'), meta: { showInMenu: true, icon: 'language ' } },
      { name: 'Community', path: 'community', component: () => import('pages/Ecosystem.vue'), meta: { showInMenu: true, icon: 'language ' } }
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
