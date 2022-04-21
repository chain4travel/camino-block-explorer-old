import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: 'c-chain' },
      { name: 'C-Chain', path: 'c-chain', component: () => import('src/pages/CChainPage.vue'), meta: { showInMenu: true } },
      { name: 'X-Chain', path: 'x-chain', component: () => import('src/pages/XChainPage.vue'), meta: { showInMenu: true } },
      { name: 'P-Chain', path: 'p-chain', component: () => import('src/pages/PChainPage.vue'), meta: { showInMenu: true } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFoundPage.vue'),
  },
];

export default routes;
