import { CHAIN_OVERVIEW, DETAILS, getAllBlocksPath, getAllBlocksPathName, getAllTransactionsPath, getAllTransactionsPathName, getBlockDetailsPath, getBlockDetailsPathName, getOverviewPath, getOverviewPathName, getTransactionDetailsPath, getTransactionsPathName, TABLES } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: getOverviewPathName(ChainType.C_CHAIN) },
    children: [
      {
        path: '',
        redirect: { name: getOverviewPathName(ChainType.C_CHAIN) },
        name: 'index'
      },
      {
        path: CHAIN_OVERVIEW,
        component: () => import('layouts/ChainOverviewLayout.vue'),
        children: [
          {
            path: '',
            redirect: { name: getOverviewPathName(ChainType.C_CHAIN) },
            name: 'index'
          },
          {
            name: getOverviewPathName(ChainType.C_CHAIN),
            path: getOverviewPath(ChainType.C_CHAIN),
            component: () => import('src/pages/CChainPage.vue'),
            meta: { showInMenu: true, label: 'C-Chain', icon: 'mdi-text-box-multiple-outline ' },
          },
          {
            name: getOverviewPathName(ChainType.X_CHAIN),
            path: getOverviewPath(ChainType.X_CHAIN),
            component: () => import('src/pages/XChainPage.vue'),
            meta: { showInMenu: true, label: 'X-Chain', icon: 'mdi-hand-coin' }
          },
          {
            name: getOverviewPathName(ChainType.P_CHAIN),
            path: getOverviewPath(ChainType.P_CHAIN),
            component: () => import('src/pages/PChainPage.vue'),
            meta: { showInMenu: true, label: 'P-Chain', icon: 'mdi-database' }
          },
        ]
      },
      {
        path: DETAILS,
        component: () => import('layouts/DetailsLayout.vue'),
        children: [
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
            name: getTransactionsPathName(ChainType.X_CHAIN),
            path: getTransactionDetailsPath(ChainType.X_CHAIN, ':transactionId'),
            component: () => import('src/pages/XChainTransactionDetails.vue'),
          },
          {
            name: getTransactionsPathName(ChainType.P_CHAIN),
            path: getTransactionDetailsPath(ChainType.P_CHAIN, ':transactionId'),
            component: () => import('src/pages/PChainTransactionDetails.vue'),
          },
        ]
      },
      {
        //find better name
        path: TABLES,
        component: () => import('layouts/TablesLayout.vue'),
        children: [
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
          {
            name: getAllTransactionsPathName(ChainType.X_CHAIN),
            path: getAllTransactionsPath(ChainType.X_CHAIN),
            component: () => import('src/pages/XChainTransactionsAll.vue'),
          },
          {
            name: getAllTransactionsPathName(ChainType.P_CHAIN),
            path: getAllTransactionsPath(ChainType.P_CHAIN),
            component: () => import('src/pages/PChainTransactionsAll.vue'),
          },
        ]
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
