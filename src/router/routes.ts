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
        name: getAllTransactionsPathName(ChainType.X_CHAIN),
        path: getAllTransactionsPath(ChainType.X_CHAIN),
        component: () => import('src/pages/XChainTransactionsAll.vue'),
      },
      //P-Chain details
      {
        name: getTransactionsPathName(ChainType.P_CHAIN),
        path: getTransactionDetailsPath(ChainType.P_CHAIN, ':transactionId'),
        component: () => import('src/pages/PChainTransactionDetails.vue'),
      },
      {
        name: getAllTransactionsPathName(ChainType.P_CHAIN),
        path: getAllTransactionsPath(ChainType.P_CHAIN),
        component: () => import('src/pages/PChainTransactionsAll.vue'),
      },
      // The wallet sends this with a magellan tx id. Reroute to correct detail view.
      // Cannot inline here as we need to make asynchronous calls to find out correct redirect route
      {
        name: 'walletTransactionsRedirect',
        path: '/tx/:txId',
        component: () => import('src/pages/TxRedirectPage.vue'),
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
