import { defineStore } from 'pinia';
import { Block } from 'src/types/block'

import { XTransaction, Fund } from 'src/types/transaction';
import axios from 'axios';
import {  transactionApi } from 'src/utils/magellan-api-utils';

import { getAvalancheClient, getMagellanBaseUrl } from 'src/utils/client-utils';


export interface MagellanTransaction {
  id: string;
  timestamp: string;
  inputs: MagellanInput[];
  outputs: MagellanOutput[];
  txFee: number;
}

export interface MagellanOutput {
  id: string,
  amount: number,
  addresses: string[]
}

export interface MagellanInput {
  output: MagellanOutput,
}

function createTransaction(magellanTransaction: MagellanTransaction): XTransaction {
  console.log(magellanTransaction);
  return <XTransaction> {
    id: magellanTransaction.id,
    timestamp: new Date(Date.parse(magellanTransaction.timestamp)),
    from: getInputFunds(magellanTransaction),
    to: getOutputFunds(magellanTransaction),
    fee: magellanTransaction.txFee,
  }
}

function getOutputFunds(magellanTransaction: MagellanTransaction): Fund[] {
  const outputfunds: Fund[] = [];
  for (const output of magellanTransaction.outputs || []) {
    outputfunds.push(createFundFromOutput(output));
  }
  return outputfunds;
}

function getInputFunds(magellanTransaction: MagellanTransaction): Fund[] {
  const inputfunds: Fund[] = [];
  if (magellanTransaction.inputs) {
    for (const input of magellanTransaction.inputs) {
      inputfunds.push(createFundFromOutput(input.output));
    }
  }
  return inputfunds;
}
function createFundFromOutput(magellanOutput: MagellanOutput): Fund {
  return <Fund> {
    address: magellanOutput.addresses[0],
    value: magellanOutput.amount
  }
}

export const useXIndexStore = defineStore('xindex', {
  state: () => ({
    xChainId: undefined as string | undefined
  }),
  getters: {
  },
  actions: {
    async loadXChainId(): Promise<string | undefined> {
      if (this.xChainId) {
        return this.xChainId;
      }
      const pChainApi = getAvalancheClient().PChain();
      const blockchains = await pChainApi.getBlockchains()
      const xChains = blockchains.filter(chain => {
        return chain.name === 'X-Chain';
      });
      this.xChainId = xChains[0].id;
      return this.xChainId;
    },

    async loadLatestBlocks(offset = 0, count = 10): Promise<Block[]> {
      const blocks = [];
      // if (import.meta.env.DEV) {
      //   for (let i = offset; i < count; i++) {
      //     blocks.unshift(createMockBlock(offset, i));
      //   }
      // }
      return Promise.resolve([]);
    },

    async loadLatestTransactions(offset = 0, count = 10): Promise<XTransaction[]> {
      const xChainId = await this.loadXChainId();
      const rawTransactions = await axios.get(`${getMagellanBaseUrl()}${transactionApi}?chainID=${xChainId}&limit=10&sort=timestamp-desc`);
      const transObjList: XTransaction[] = [];
      for (const transaction of rawTransactions.data.transactions) {
        const mappedTransaction = createTransaction(transaction);
        transObjList.push(mappedTransaction);
      }

      return Promise.resolve(transObjList);
    },

    async loadTransactionById(transactionId: string): Promise<XTransaction> {
      // if (import.meta.env.DEV) {
      //   const mock = createMockTransaction(1);
      //   mock.hash = transactionId;
      //   return Promise.resolve(mock);
      // }
      const rawTransaction = await axios.get(getMagellanBaseUrl() + transactionApi + '/' + transactionId);
      return Promise.resolve(createTransaction(rawTransaction.data))
    },

    async loadByBlockId(blockId: string): Promise<Block> {
      // if (import.meta.env.DEV) {
      //   const mock = createMockBlock(0, 1);
      //   mock.hash = blockId;
      //   return Promise.resolve(mock);
      // }
      return Promise.resolve({});
    }
  },
});
