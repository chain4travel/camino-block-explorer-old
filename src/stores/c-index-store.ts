import { defineStore } from 'pinia';
import Web3 from 'web3'
import {
  Avalanche,
} from 'avalanche'
import { GetContainerRangeResponse } from 'avalanche/dist/apis/index/interfaces';

import { Block } from 'src/types/block'
import { useAppConfig } from 'src/stores/app-config'

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

function createBlock(av_container: Record<string, unknown>, eth_block: Record<string, unknown>) : Block {
  return <Block> {
    id: av_container.id,
    height: av_container.index,
    timestamp: new Date(Date.parse(av_container.timestamp as string)),
    hash: eth_block.hash,
    burned: eth_block.gasUsed,
    transactions: (eth_block.transactions as Array<unknown>).length
  }
}

const getAvalancheClient = () => {
  const network = useAppConfig().getActive;
  return new Avalanche(network.host, network.port, network.protocol);
}

const getWeb3Client = () => {
  const network = useAppConfig().getActive;
  return new Web3(`${network.protocol}://${network.host}:${network.port}/ext/bc/C/rpc`)
}

// s: await useCIndexStore().loadBlocks(),
export const useCIndexStore = defineStore('cindex', {
  state: () => ({
    blocks: [] as Block[],
    avalancheClient: getAvalancheClient(),
    baseUrl: '/ext/index/C/block'
  }),
  getters: {
  },
  actions: {
    async loadBlocks(offset = 0, count = 10): Promise<Block[]> {
      const web3 = getWeb3Client();

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
