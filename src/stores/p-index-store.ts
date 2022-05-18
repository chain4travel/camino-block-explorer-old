import { defineStore } from 'pinia';

import { XPTransaction } from 'src/types/transaction';
import { useMagellanTxStore } from 'src/stores/magellan-tx-store';

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

    async loadTransactions(offset = 0, count = 10): Promise<XPTransaction[]> {
      return await this.store.loadTransactions('p', offset, count);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      return await this.store.loadTransactionById(transactionId);
    },
  },
});
