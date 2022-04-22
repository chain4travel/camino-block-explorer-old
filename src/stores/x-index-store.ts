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
      for (let i = offset; i < count; i++) {
        blocks.unshift(createMockBlock(offset, i));
      }
      return Promise.resolve(blocks);
    },
    async loadLatestTransactions(offset = 0, count = 10): Promise<Transaction[]> {
      const transactions = [];
      for (let i = offset; i < count; i++) {
        transactions.unshift(createMockTransaction(offset));
      }
      return Promise.resolve(transactions);
    }
  },
});
