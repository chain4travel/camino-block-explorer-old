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
      // these will probably not be part of this application, but instead lead to external links
      { name: 'Documentation', path: 'documentation', component: () => import('src/pages/StatsPage.vue'), meta: { showInMenu: true } },
      { name: 'Wallet', path: 'wallet', component: () => import('src/pages/WalletPage.vue'), meta: { showInMenu: true } }
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
