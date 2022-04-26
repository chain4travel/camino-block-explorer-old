import { defineStore } from 'pinia';
import { Block } from 'src/types/block'

import { Transaction } from 'src/types/transaction';
import { createMockBlock, createMockTransaction } from 'src/utils/mock-utils';


export const useXIndexStore = defineStore('xindex', {
  state: () => ({
  }),
  getters: {
  },
  actions: {
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
      const transactions = [];
      if (import.meta.env.DEV) {
        for (let i = offset; i < count; i++) {
          transactions.unshift(createMockTransaction(offset));
        }
      }
      return Promise.resolve(transactions);
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
