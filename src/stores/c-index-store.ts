import { defineStore } from 'pinia';
import { BlockTableData } from 'src/types/block'
import { CTransaction } from 'src/types/transaction';
import { BlockDetails } from 'src/types/block-detail';
import { TranscationDetails } from 'src/types/transaction-detail';
import {  getMagellanBaseUrl, getWeb3Client } from 'src/utils/client-utils';
import axios from 'axios';
import { cBlocksApi } from 'src/utils/magellan-api-utils';
import { MagellanCBlocksResponse } from 'src/types/magellan';


async function loadBlocksAndTransactions(blockOffset = 0, blockCount = 10, transactionOffset = 0, transactionCount = 10): Promise<MagellanCBlocksResponse> {
  return await (await axios.get(`${getMagellanBaseUrl()}${cBlocksApi}?limit=${blockCount}&limit=${transactionCount}&offset=${blockOffset}&offset=${transactionOffset}`)).data;
}

export const useCIndexStore = defineStore('cindex', {
  state: () => ({
    baseUrl: '/ext/index/C/block'
  }),
  getters: {
  },
  actions: {
    async loadLatestBlocks(offset = 0, count = 10): Promise<BlockTableData[]> {
      try {
        const cBlockresponse = await loadBlocksAndTransactions(offset, count, 0,0);
        if(!cBlockresponse.blocks) {
          return[];
        }
        return cBlockresponse.blocks.map(block => <BlockTableData>{
          hash: block.hash,
          number: parseInt(block.number),
          timestamp: new Date(block.timestamp * 1000),
          gasLimit: parseInt(block.gasLimit),
          gasUsed: parseInt(block.gasUsed),
          numberOfTransactions: block.evmTx ? block.evmTx : 0
        });
      } catch (e) {
        console.error(e);
        // todo add q notify as display of error! (or throw and let component deal with it)
        return [];
      }
    },
    async loadLatestTransactions(offset = 0, count = 10): Promise<CTransaction[]> {
      // currently offset is not available "natively", so we add offset and count and skip the offset elements in processing
      // this does not work for more than 5k elements at once.. will need to adjust for that to work
      try {
        const cBlockresponse = await loadBlocksAndTransactions(0, 0, offset, count);
        if(!cBlockresponse.transactions) {
          return [];
        }
        return cBlockresponse.transactions.map(element => (<CTransaction>{
          block: element.block,
          from: element.from,
          hash: element.hash,
          status: element.status +'',
          timestamp: new Date(element.timestamp*1000),
          to: element.to,
          value: element.value + ''
        }));
      } catch (e) {
        return []
      }
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
