import { defineStore } from 'pinia';

import { XPTransaction } from 'src/types/transaction';
import { useMagellanTxStore } from 'src/stores/magellan-tx-store';

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

    async loadTransactions(offset = 0, count = 10): Promise<XPTransaction[]> {
      return await this.store.loadTransactions('x', offset, count);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      return await this.store.loadTransactionById(transactionId);
    },
  },
});
