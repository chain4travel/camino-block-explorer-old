import { defineStore } from 'pinia';
import { Block } from 'src/types/block'
import Web3 from 'web3'

import {
  Avalanche,
} from 'avalanche'
import { GetContainerRangeResponse } from 'avalanche/dist/apis/index/interfaces';

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const createBlock = (av_container, eth_block) => {
  return new Block(av_container.id,
    av_container.index,
      new Date(Date.parse(av_container.timestamp)),
      eth_block.hash,
      eth_block.gasUsed,
      eth_block.transactions.length
      )
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
    async loadBlocks(offset = 0, count = 10) : Promise<Block[]> {
      const web3 = new Web3("http://127.0.0.1:9650/ext/bc/C/rpc")

      const indexAPI = this.avalancheClient.Index();
      try {
        const lastAccepted = await indexAPI.getLastAccepted('hex', this.baseUrl);
        const currentIndex = parseInt(lastAccepted.index)
        const start_index = clamp(currentIndex - offset - count, 0, currentIndex)

        const containerList: GetContainerRangeResponse[] = await indexAPI.getContainerRange(start_index, count, 'hex', this.baseUrl)

        const blocks: Block[] = [];
        for (const container of containerList.containers) {
          const eth3_block = await web3.eth.getBlock(container.index,);
          const block = createBlock(container, eth3_block);
          console.log(eth3_block);
          blocks.unshift(block);
        }

        return blocks;
      } catch (e) {
        console.error(e);
        // todo add q notify as display of error! (or throw and let component deal with it)
        return [];
      }
    },
  },
});
