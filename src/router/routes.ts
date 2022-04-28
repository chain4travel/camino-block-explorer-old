import { getAllBlocksPath, getAllBlocksPathName, getAllTransactionsPath, getAllTransactionsPathName, getBasePath, getBlockDetailsPath, getBlockDetailsPathName, getPathName, getTransactionDetailsPath, getTransactionsPathName } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: ChainType.C_CHAIN,
        name: 'index'
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
      //C-Chain Details
      {
        name: getTransactionsPathName(ChainType.C_CHAIN),
        path: getTransactionDetailsPath(ChainType.C_CHAIN, ':transactionId'),
        component: () => import('src/pages/CChainTransactionDetails.vue'),
      },
      {
        name: getBlockDetailsPathName(ChainType.C_CHAIN),
        path: getBlockDetailsPath(ChainType.C_CHAIN, ':blockId'),
        component: () => import('src/pages/CChainBlockDetails.vue'),
      },
      {
        name: getAllBlocksPathName(ChainType.C_CHAIN),
        path: getAllBlocksPath(ChainType.C_CHAIN),
        component: () => import('src/pages/CChainBlocksAll.vue'),
      },
      {
        name: getAllTransactionsPathName(ChainType.C_CHAIN),
        path: getAllTransactionsPath(ChainType.C_CHAIN),
        component: () => import('src/pages/CChainTransactionsAll.vue'),
      },
      //X-Chain details
      {
        name: getTransactionsPathName(ChainType.X_CHAIN),
        path: getTransactionDetailsPath(ChainType.X_CHAIN, ':transactionId'),
        component: () => import('src/pages/XChainTransactionDetails.vue'),
      },
      {
        name: getBlockDetailsPathName(ChainType.X_CHAIN),
        path: getBlockDetailsPath(ChainType.X_CHAIN, ':blockId'),
        component: () => import('src/pages/XChainBlockDetails.vue'),
      },
      //P-Chain details
      {
        name: getTransactionsPathName(ChainType.P_CHAIN),
        path: getTransactionDetailsPath(ChainType.P_CHAIN, ':transactionId'),
        component: () => import('src/pages/PChainTransactionDetails.vue'),
      },
      {
        name: getBlockDetailsPathName(ChainType.P_CHAIN),
        path: getBlockDetailsPath(ChainType.P_CHAIN, ':blockId'),
        component: () => import('src/pages/PChainBlockDetails.vue'),
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
