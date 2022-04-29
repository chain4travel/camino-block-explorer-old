import axios from 'axios';
import { defineStore } from 'pinia';
import { XTransaction } from 'src/types/transaction';
import { getChainId, getMagellanBaseUrl } from 'src/utils/client-utils';
import { transactionApi } from 'src/utils/magellan-api-utils';
import { createTransaction, getInputFunds, getOutputFunds, MagellanResponse, MagellanTransaction } from './x-index-store';

export const usePIndexStore = defineStore('pindex', {
  state: () => ({
    pChainId : undefined as string|undefined
  }),
  getters: {
  },
  actions: {
    async getChainId() : Promise<string>{
      if(!this.pChainId) {
        this.pChainId = await getChainId('p');
      }
      return this.pChainId
    },
    async loadLatestTransactions(offset = 0, count = 10): Promise<XTransaction[]> {
      const chainId = await this.getChainId();
      const rawTransactions: MagellanResponse = await (await axios.get(`${getMagellanBaseUrl()}${transactionApi}?chainID=${chainId}&limit=${offset+count}&sort=timestamp-desc`)).data;
      return rawTransactions.transactions.splice(offset, count).map(createTransaction);
    },
  },
});
