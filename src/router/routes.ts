import { getBasePath, getPathName, getTransactionDetailsPath, getTransactionsPathName } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: ChainType.C_CHAIN
      },
      {
        name: getPathName(ChainType.C_CHAIN),
        path: getBasePath(ChainType.C_CHAIN),
        component: () => import('src/pages/CChainPage.vue'),
        meta: { showInMenu: true },
      },
      {
        name: getPathName(ChainType.X_CHAIN),
        path: getBasePath(ChainType.X_CHAIN),
        component: () => import('src/pages/XChainPage.vue'),
        meta: { showInMenu: true }
      },
      {
        name: getPathName(ChainType.P_CHAIN),
        path: getBasePath(ChainType.P_CHAIN),
        component: () => import('src/pages/PChainPage.vue'),
        meta: { showInMenu: true }
      },
      {
        name: getTransactionsPathName(ChainType.C_CHAIN),
        path: getTransactionDetailsPath(ChainType.C_CHAIN, ':transactionId'),
        component: () => import('src/pages/CChainTransactionDetails.vue'),
      },
      // Always leave this as last one,
      // but you can also remove it
      {
        path: '/:catchAll(.*)*',
        component: () => import('src/pages/ErrorNotFoundPage.vue'),
      },
    ],
  },



];

export default routes;
