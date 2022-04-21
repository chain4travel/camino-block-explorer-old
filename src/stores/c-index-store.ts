import { defineStore } from 'pinia';
import { Block } from 'src/types/block'

import {
  Avalanche,
} from 'avalanche'
import { GetContainerRangeResponse } from 'avalanche/dist/apis/index/interfaces';

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const mapContainer = (container) => {
  return new Block(container.id, container.index, new Date(Date.parse(container.timestamp)))
}

export const useCIndexStore = defineStore('cindex', {
  state: () => ({
    blocks: [] as Block[],
    avalancheClient: new Avalanche('127.0.0.1', 9650, 'http', 12345),
    baseUrl: '/ext/index/C/block'
  }),
  getters: {
  },
  actions: {
    async loadBlocks(offset = 0, count = 10): Promise<Block[]> {
      const indexAPI = this.avalancheClient.Index();
      try {
        const lastAccepted = await indexAPI.getLastAccepted('hex', this.baseUrl);
        const currentIndex = parseInt(lastAccepted.index)
        const start_index = clamp(currentIndex - offset - count, 0, currentIndex)

        const containerList: GetContainerRangeResponse[] = await indexAPI.getContainerRange(start_index, count, 'hex', this.baseUrl)

        const blocks: Block[] = [];
        containerList.containers.forEach(container => {
          blocks.unshift(mapContainer(container))
        });

        return blocks;
      } catch (e) {
        console.error(e);
        // todo add q notify as display of error! (or throw and let component deal with it)
        return [];
      }
    },
  },
});
