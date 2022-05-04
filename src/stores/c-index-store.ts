import { defineStore } from 'pinia';
import { BlockTableData } from 'src/types/block'
import { CTransaction } from 'src/types/transaction';
import { BlockDetails } from 'src/types/block-detail';
import {  getMagellanBaseUrl } from 'src/utils/client-utils';
import axios from 'axios';
import { cBlocksApi, cTransactionApi, cBlocksDetailsApi } from 'src/utils/magellan-api-utils';
import { MagellanCBlocksResponse, CTransactionResponse, MagellanBlockDetail, MagellanTransactionDetail } from 'src/types/magellan-types';


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
    async loadTransactionById(transactionId: string): Promise<MagellanTransactionDetail> {
      // const web3 = getWeb3Client();
      // const transaction = await web3.eth.getTransaction(transactionId);
      // const receipt = await web3.eth.getTransactionReceipt(transactionId);
      // return { ...transaction, ...receipt }
      return (await this.loadMagellanTransactionbyHash(transactionId)).Transactions[0]
    },
    async loadByBlockId(blockNumber: number): Promise<BlockDetails> {
      const block = await this.loadMagellanBlockByNumber(blockNumber);
      let nextBlock: MagellanBlockDetail|undefined = undefined
      try {
         nextBlock = await this.loadMagellanBlockByNumber(blockNumber+1)
      } catch (e) {
        // no next block found, probably this is the newest block
      }
      return {
        additionalInformation: {
          difficulty: parseInt(block.header.difficulty),
          extraData: block.header.extraData,
          logsBloom: block.header.logsBloom,
          nonce: parseInt(block.header.nonce),
          uncles: block.header.sha3Uncles
        },
        blockNumber: parseInt(block.header.number),
        childHash: nextBlock ? nextBlock.header.hash : undefined,
        childBlockNumber: nextBlock ? parseInt(nextBlock.header.number) : undefined,
        hash: block.header.hash,
        parentHash: block.header.parentHash,
        parentBlockNumber: parseInt(block.header.number) ? parseInt(block.header.number) -1 : undefined,
        fees: parseInt(block.header.gasUsed),
        baseGaseFee: parseInt(block.header.baseFeePerGas),
        transactionCount: block.transactions ? block.transactions.length : 0,
        gasLimit: parseInt(block.header.gasLimit),
        gasUsed: parseInt(block.header.gasUsed),
        timestamp: new Date(block.header.timestamp * 1000)
      };
    },
    async loadMagellanTransactionbyHash(transactionHash: string): Promise<CTransactionResponse> {
      //&toAddress=${transactionCount}&fromAddress=${blockOffset}&address=${transactionOffset}&blockStart=0&blockEnd=1`)
      return await (await axios.get(`${getMagellanBaseUrl()}${cTransactionApi}?hash=${transactionHash}`)).data;
    },
    async loadMagellanBlockByNumber(blockNumber: number): Promise<MagellanBlockDetail> {
      //&toAddress=${transactionCount}&fromAddress=${blockOffset}&address=${transactionOffset}&blockStart=0&blockEnd=1`)
      return await (await axios.get(`${getMagellanBaseUrl()}${cBlocksDetailsApi}/${blockNumber}`)).data;
    }
  },
});
