import { defineStore } from 'pinia';

import { XPTransaction } from 'src/types/transaction';
import {  useMagellanTxStore } from 'src/stores/magellan-tx-store';

export const usePIndexStore = defineStore('pindex', {
  state: () => ({
    store: useMagellanTxStore()
  }),
  getters: {
  },
  actions: {
    async getChainId() : Promise<string>{
      return await this.store.getChainId('p');
    },

    async loadLatestTransactions(offset = 0, count = 10): Promise<XPTransaction[]> {
      return await this.store.loadLatestTransactions('p', offset, count);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      return await this.store.loadTransactionById(transactionId);
    },
  },
});
