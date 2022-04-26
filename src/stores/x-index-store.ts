import { defineStore } from 'pinia';
import { Block } from 'src/types/block'

import { Transaction } from 'src/types/transaction';
import { createMockBlock, createMockTransaction } from 'src/utils/mock-utils';
import axios from 'axios';
import { useAppConfig } from './app-config';
import { baseEndpoint, transactionApi } from 'src/utils/ortelius-api-utils';


function getOrteliusBaseUrl(): string {
  return useAppConfig().getActive.orteliusAddress;
}

export const useXIndexStore = defineStore('xindex', {
  state: () => ({
    xChainId: undefined as string | undefined
  }),
  getters: {
  },
  actions: {
    async loadXChainId(): Promise<string | undefined> {
      if (this.xChainId) {
        return this.xChainId;
      }
      const response = await axios.get(getOrteliusBaseUrl() + baseEndpoint)
      console.log('response', response);
      const data = await response.data;
      const value = Object.entries(data.chains).filter(([key, value]) => {
        console.log('value', value)
        return value.chainAlias === 'x';
      })
      if (value && value.length > 0) {
        this.xChainId = value[0][0];
      }
      return this.xChainId;
    },
    async loadLatestBlocks(offset = 0, count = 10): Promise<Block[]> {
      const blocks = [];
      if (import.meta.env.DEV) {
        for (let i = offset; i < count; i++) {
          blocks.unshift(createMockBlock(offset, i));
        }
      }
      return Promise.resolve(blocks);
    },
    async loadLatestTransactions(offset = 0, count = 10): Promise<Transaction[]> {
      const xChainId = await this.loadXChainId();
      console.log('ChainId', xChainId)
      const rawTransactions = await axios.get(getOrteliusBaseUrl() + transactionApi + '?chainID=' + xChainId);
      console.log('rawTransactions', rawTransactions.data)

      return Promise.resolve([]);
    },
    async loadTransactionById(transactionId: string): Promise<Transaction> {
      if (import.meta.env.DEV) {
        const mock = createMockTransaction(1);
        mock.hash = transactionId;
        return Promise.resolve(mock);
      }
      return Promise.resolve({})
    },
    async loadByBlockId(blockId: string): Promise<Block> {
      if (import.meta.env.DEV) {
        const mock = createMockBlock(0, 1);
        mock.hash = blockId;
        return Promise.resolve(mock);
      }
      return Promise.resolve({});
    }
  },
});
