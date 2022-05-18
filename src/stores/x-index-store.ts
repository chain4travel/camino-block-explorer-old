import { defineStore } from 'pinia';

import { XPTransaction } from 'src/types/transaction';
import { useMagellanTxStore } from 'src/stores/magellan-tx-store';
import { usePIndexStore } from './p-index-store';
import { Timeframe } from 'src/types/chain-view-loader';
import { DateTime } from 'luxon';
import { getStartDate } from 'src/utils/date-utils';


export const useXIndexStore = defineStore('xindex', {
  state: () => ({
    store: useMagellanTxStore(),
    pStore: usePIndexStore()
  }),
  getters: {
  },
  actions: {
    async getNumberOfValidators(): Promise<number> {
      return this.pStore.getNumberOfValidators()
    },
    async getChainId(): Promise<string> {
      return await this.store.getChainId('x');
    },
    async loadNumberOfTransactions(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionAggregates('x', startDate.toISO(), currentDate.toISO());
      return result && result.aggregates && result.aggregates.transactionCount;
    },
    async loadTotalGasFess(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionFeesAggregates('x', startDate.toISO(), currentDate.toISO());
      return result && result.aggregates && parseInt(result.aggregates.txfee);
    },
    async loadTransactions(offset = 0, count = 10): Promise<XPTransaction[]> {
      return await this.store.loadTransactions('x', offset, count);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      return await this.store.loadTransactionById(transactionId);
    },
  },
});
