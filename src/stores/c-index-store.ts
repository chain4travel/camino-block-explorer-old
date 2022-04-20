import { defineStore } from 'pinia';
import { Transaction } from 'src/types/transaction'

import {
  Avalanche,
} from 'avalanche'

const clamp = (num: number, min: number , max: number) => Math.min(Math.max(num, min), max)

export const useCIndexStore = defineStore('cindex', {
  state: () => ({
    transactions: [],
    avalancheClient: new Avalanche('127.0.0.1', 9650,'http', 12345),
    baseUrl: '/ext/index/C/block'
  }),
  getters: {
  },
  actions: {
    async loadTXs(offset = 0, count = 10) : Promise<Transaction[]> {
      console.log(offset, count);
      const indexAPI = this.avalancheClient.Index();
      const lastAccepted = await indexAPI.getLastAccepted('hex', this.baseUrl);
      const currentIndex = parseInt(lastAccepted.index)
      const start_index = clamp(currentIndex - offset - count, 0, currentIndex)
      
      console.log('pull list with start and count', start_index, count);
      const containerList = await indexAPI.getContainerRange(start_index, count, 'hex', this.baseUrl)

      console.log(containerList);
      return [];
    },
  },
});
