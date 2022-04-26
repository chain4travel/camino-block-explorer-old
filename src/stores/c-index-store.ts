import { defineStore } from 'pinia';
import Web3 from 'web3'
import {
  Avalanche,
} from 'avalanche'
import { GetContainerRangeResponse } from 'avalanche/dist/apis/index/interfaces';

import { Block } from 'src/types/block'
import { useAppConfig } from 'src/stores/app-config'
import { Transaction } from 'src/types/transaction';

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

function createBlock(av_container: Record<string, unknown>, eth_block: Record<string, unknown>): Block {
  return <Block>{
    ...eth_block,
    id: av_container.id,
    height: av_container.index,
    timestamp: new Date(Date.parse(av_container.timestamp as string)),
    hash: eth_block.hash,
    burned: eth_block.gasUsed,
    transactions: (eth_block.transactions as Array<unknown>),
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
    transactions: [] as Transaction[],
    baseUrl: '/ext/index/C/block'
  }),
  getters: {
  },
  actions: {
    async loadLatestBlocks(forceReload = false, offset = 0, count = 10): Promise<Block[]> {
      if (!forceReload && this.blocks && this.blocks.length > 0) {
        return this.blocks;
      }
      const web3 = getWeb3Client();
      const avalancheClient = getAvalancheClient();
      const indexAPI = avalancheClient.Index();
      try {
        const lastAccepted = await indexAPI.getLastAccepted('hex', this.baseUrl);
        const currentIndex = parseInt(lastAccepted.index)
        const start_index = clamp(currentIndex - offset - count, 0, currentIndex)

        const containerList: GetContainerRangeResponse[] = await indexAPI.getContainerRange(start_index, count, 'hex', this.baseUrl)
        const blocks: Block[] = [];
        for (const container of containerList.containers) {
          console.log('Av container', container)
          const eth3_block = await web3.eth.getBlock(container.index);
          const block = createBlock(container, eth3_block);
          blocks.unshift(block);
        }
        this.blocks = blocks;
        return this.blocks;
      } catch (e) {
        console.error(e);
        // todo add q notify as display of error! (or throw and let component deal with it)
        return [];
      }
    },
    async loadLatestTransactions(forceReload = false, offset = 0, count = 10): Promise<Transaction[]> {
      if (!forceReload && this.transactions && this.transactions.length > 0) {
        return this.transactions;
      }
      const transactions = [];
      const latestBlocks = await this.loadLatestBlocks();
      const web3 = getWeb3Client();
      for (const block of latestBlocks) {
        for (const singleTransaction of block.transactions || []) {
          const transaction = await web3.eth.getTransaction(singleTransaction)
          const receipt = await web3.eth.getTransactionReceipt(singleTransaction);
          console.log('transaction', transaction);
          console.log('receipt', receipt);
          transactions.push(<Transaction>{
            ...transaction,
            ...receipt,
            timestamp: block.timestamp
          })
        }
      }
      this.transactions = transactions;
      return transactions;
    },
    async loadTransactionById(transactionId: string): Promise<Transaction> {
      const web3 = getWeb3Client();
      const transaction = await web3.eth.getTransaction(transactionId);
      const receipt = await web3.eth.getTransactionReceipt(transactionId);
      return { ...transaction, ...receipt }
    },
    async loadByBlockId(blockId: string): Promise<Block> {
      const web3 = getWeb3Client();
      const avalancheClient = getAvalancheClient();
      const indexAPI = avalancheClient.Index();
      const container = await indexAPI.getContainerByID(blockId, 'hex', this.baseUrl);
      console.log('Container Loaded yay', container)
      const eth3_block = await web3.eth.getBlock(container.index);
      console.log('eth block Loaded yay', container)
      const block = createBlock(container, eth3_block);
      return block;
    }
  },
});
