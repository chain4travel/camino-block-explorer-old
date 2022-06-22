import { defineStore } from 'pinia';

import { XPTransaction } from 'src/types/transaction';
import { useMagellanTxStore } from 'src/stores/magellan-tx-store';
import { useAppConfig } from 'src/stores/app-config';
import axios from 'axios';
import { DateTime } from 'luxon';
import { getStartDate } from 'src/utils/date-utils';
import { Timeframe } from 'src/types/chain-loader';
import { NodeValidator, NodeValidatorsResponse } from 'src/types/node-types';

export const usePIndexStore = defineStore('pindex', {
  state: () => ({
    store: useMagellanTxStore(),
    appConfig: useAppConfig(),
  }),
  getters: {},
  actions: {
    async refreshAll(value: Timeframe) {
      this.store.gasFeesLoading = true;
      this.store.transactionsLoading = true;
      const [transactionAggregate, gasFeeAggregate, validators] =
        await Promise.all([
          this.loadNumberOfTransactions(value),
          this.loadTotalGasFess(value),
          this.getNumberOfValidators(),
        ]);
      this.store.numberOfActiveValidators =
        validators?.numberOfActiveValidators;
      this.store.numberOfValidators = validators?.numberOfValidators;

      this.store.numberOfTransactions = transactionAggregate || 0;
      this.store.totalGasFees = gasFeeAggregate || 0;
      this.store.gasFeesLoading = false;
      this.store.transactionsLoading = false;
    },
    async loadNumberOfTransactions(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionAggregates(
        'p',
        startDate.toISO(),
        currentDate.toISO()
      );
      return result && result.aggregates && result.aggregates.transactionCount;
    },
    async loadTotalGasFess(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionFeesAggregates(
        'p',
        startDate.toISO(),
        currentDate.toISO()
      );
      return result && result.aggregates && parseInt(result.aggregates.txfee);
    },
    async getValidators(): Promise<object> {
      const network = this.appConfig.getActive;
      try {
        const response = await axios.post(
          `${network.protocol}://${network.host}:${network.port}/ext/bc/P`,
          { jsonrpc: '2.0', method: 'platform.getCurrentValidators', id: 1 }
        );
        const data = response.data;
        if (data && data.result && data.result.validators)
          return data.result.validators;
        return {};
      } catch (e) {
        // COnsider returning text here?
        console.log('Could not load validators', e);
        return {};
      }
    },
    async getNumberOfValidators(): Promise<NodeValidatorsResponse> {
      const network = this.appConfig.getActive;
      try {
        const response = await axios.post(
          `${network.protocol}://${network.host}:${network.port}/ext/bc/P`,
          { jsonrpc: '2.0', method: 'platform.getCurrentValidators', id: 1 }
        );
        const data = response.data;
        if (data && data.result && data.result.validators)
          return {
            numberOfValidators: data.result.validators.length,
            numberOfActiveValidators: data.result.validators.filter(
              (v: NodeValidator) => v.connected
            ).length,
          };
        return { numberOfValidators: 0, numberOfActiveValidators: 0 };
      } catch (e) {
        // COnsider returning text here?
        console.log('Could not load validator count', e);
        return { numberOfValidators: 0, numberOfActiveValidators: 0 };
      }
    },

    async getChainId(): Promise<string> {
      return await this.store.getChainId('p');
    },

    async loadTransactions(offset = 0, count = 10): Promise<XPTransaction[]> {
      return await this.store.loadTransactions('p', offset, count, null);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      return await this.store.loadTransactionById(transactionId);
    },
  },
});
