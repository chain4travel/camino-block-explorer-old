import { defineStore } from 'pinia';

import { XPTransaction } from 'src/types/transaction';
import {  useMagellanTxStore } from 'src/stores/magellan-tx-store';

export const useXIndexStore = defineStore('xindex', {
  state: () => ({
    store: useMagellanTxStore()
  }),
  getters: {
  },
  actions: {
    async getChainId() : Promise<string>{
      return await this.store.getChainId('x');
    },

    async loadLatestTransactions(offset = 0, count = 10): Promise<XPTransaction[]> {
      console.log('loading X Transaction', offset, count)
      return await this.store.loadLatestTransactions('x', offset, count);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      return await this.store.loadTransactionById(transactionId);
    },
  },
});
