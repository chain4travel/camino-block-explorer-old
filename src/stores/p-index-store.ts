import { defineStore } from 'pinia';

import { XPTransaction } from 'src/types/transaction';
import { useMagellanTxStore } from 'src/stores/magellan-tx-store';
import { useAppConfig } from 'src/stores/app-config';
import axios from 'axios';
import { DateTime } from 'luxon';
import { getStartDate } from 'src/utils/date-utils';

export const usePIndexStore = defineStore('pindex', {
  state: () => ({
    store: useMagellanTxStore(),
    appConfig: useAppConfig(),
  }),
  getters: {
  },
  actions: {
    async loadNumberOfTransactions(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionAggregates('p', startDate.toISO(), currentDate.toISO());
      return result && result.aggregates && result.aggregates.transactionCount;
    },
    async loadTotalGasFess(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionFeesAggregates('p', startDate.toISO(), currentDate.toISO());
      return result && result.aggregates && parseInt(result.aggregates.txfee);
    },
    async getNumberOfValidators(): Promise<object> {
      const network = this.appConfig.getActive;
      try {
        const response = await axios.post(`${network.protocol}://${network.host}:${network.port}/ext/bc/P`, { 'jsonrpc': '2.0', 'method': 'platform.getCurrentValidators', 'id': 1 })
        const data = response.data;
        if (data && data.result && data.result.validators)
          return {
            numberOfValidators: data.result.validators.length,
            numberOfActiveValidators: data.result.validators.filter(v => v.connected).length,
          };
        return {};
      } catch (e) {
        // COnsider returning text here?
        console.log('Could not load validator count', e)
        return {};
      }
    },

    async getChainId(): Promise<string> {
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
