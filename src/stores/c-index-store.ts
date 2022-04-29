import { defineStore } from 'pinia';
import { GetContainerRangeResponse } from 'avalanche/dist/apis/index/interfaces';
import { Block } from 'src/types/block'
import { CTransaction, CTransactionList } from 'src/types/transaction';
import { BlockDetails } from 'src/types/block-detail';
import { TranscationDetails } from 'src/types/transaction-detail';
import { BlockTransactionString } from 'web3-eth';
import { getAvalancheClient, getWeb3Client } from 'src/utils/client-utils';

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

function createBlock(av_container: Record<string, unknown>, eth_block: BlockTransactionString): Block {
  return <Block>{
    height: eth_block.number,
    timestamp: new Date(Date.parse(av_container.timestamp as string)),
    hash: eth_block.hash,
    gasUsed: eth_block.gasUsed,
    transactions: (eth_block.transactions as Array<unknown>),
  }
}

export const useCIndexStore = defineStore('cindex', {
  state: () => ({
    blocks: [] as Block[],
    transactionResponse: {
      transactions: [],
      hasMore: true
    } as CTransactionList,
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
        const start_index = clamp(currentIndex - offset - count + 1, 0, currentIndex)
        let containerList: GetContainerRangeResponse[] = []

        try {
          containerList = await indexAPI.getContainerRange(start_index, count, 'hex', this.baseUrl)
        } catch (e) {
          console.log('avalanche did not work', e)
        }
        const blocks: Block[] = [];
        for (const container of containerList.containers) {
          try {
            const eth3_block = await web3.eth.getBlock(parseInt(container.index) + 1);
            const block = createBlock(container, eth3_block);
            blocks.unshift(block);
          } catch (e) {
            console.log('did not work', e)
          }

        }
        this.blocks = blocks;
        return this.blocks;
      } catch (e) {
        console.error(e);
        // todo add q notify as display of error! (or throw and let component deal with it)
        return [];
      }
    },
    async loadLatestTransactions(forceReload = false, offset = 0, count = 10): Promise<CTransactionList> {
      // if (!forceReload && this.transactionResponse && this.transactionResponse.transactions.length > 0) {
      //   return this.transactionResponse;
      // }
      const transactions = [];
      let hasMoreTransactions = true;
      let currentblockNumber = undefined
      const web3 = getWeb3Client();
      while (transactions.length < count+offset && hasMoreTransactions) {
        const latestBlocks = await this.loadLatestBlocks(forceReload, 0, count+offset);
        console.log('Loaded blocks count', latestBlocks.length)
        for (const block of latestBlocks) {
          for (const singleTransaction of block.transactions || []) {
            const transaction = await web3.eth.getTransaction(singleTransaction)
            const receipt = await web3.eth.getTransactionReceipt(singleTransaction);
            transactions.push(<CTransaction>{
              block: transaction.blockNumber,
              from: transaction.from,
              to: transaction.to,
              gasPrice: transaction.gas,
              hash: transaction.hash,
              status: receipt.status ? 'success' : 'failed',
              value: transaction.value,
              timestamp: block.timestamp
            })
          }
          currentblockNumber = block.height
          hasMoreTransactions = currentblockNumber !== 1;
        }
      }
      console.log('have all transactions', transactions);
      console.log('slicing', offset, count, transactions.slice(offset,count))
      this.transactionResponse = {transactions: transactions.slice(offset,offset+count), hasMore: hasMoreTransactions};
      console.log('Returning transactions', this.transactionResponse)
      return this.transactionResponse;
    },
    async loadTransactionById(transactionId: string): Promise<TranscationDetails> {
      const web3 = getWeb3Client();
      const transaction = await web3.eth.getTransaction(transactionId);
      const receipt = await web3.eth.getTransactionReceipt(transactionId);
      return { ...transaction, ...receipt }
    },
    async loadByBlockId(blockId: string): Promise<BlockDetails> {
      const web3 = getWeb3Client();
      const eth3_block = await web3.eth.getBlock(blockId);
      let nextBlock = undefined
      try {
        nextBlock = await web3.eth.getBlock(eth3_block.number + 1);
      } catch (e) {
        // there was no next block
        console.log('no child block found')
      }
      return {
        additionalInformation: {
          difficulty: eth3_block.difficulty,
          extraData: eth3_block.extraData,
          logsBloom: eth3_block.logsBloom,
          nonce: eth3_block.nonce,
          totalDifficulty: eth3_block.totalDifficulty,
          uncles: eth3_block.uncles
        },
        blockNumber: eth3_block.number,
        childHash: nextBlock ? nextBlock.hash : undefined,
        hash: eth3_block.hash,
        parentHash: eth3_block.parentHash,
        fees: eth3_block.gasUsed,
        baseGaseFee: eth3_block.baseFeePerGas,
        transactionCount: eth3_block.transactions ? eth3_block.transactions.length : 0,
        gasLimit: eth3_block.gasLimit,
        gasUsed: eth3_block.gasUsed,
        size: eth3_block.size,
        timestamp: new Date(eth3_block.timestamp * 1000)
      };
    },
  },
});
