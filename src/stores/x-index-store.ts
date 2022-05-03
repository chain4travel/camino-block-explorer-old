import { defineStore } from 'pinia';
import { Block } from 'src/types/block'

import { XTransaction, Fund } from 'src/types/transaction';
import axios from 'axios';
import {  transactionApi } from 'src/utils/magellan-api-utils';

import { getChainId, getMagellanBaseUrl } from 'src/utils/client-utils';

export interface MagellanResponse {
  transactions: MagellanTransaction[];
  startTime: string;
  endTime: string;
}

export interface MagellanTransaction {
  id: string;
  timestamp: string;
  inputs: MagellanInput[];
  outputs: MagellanOutput[];
  txFee: number;
  type: string;
  chainID: string;
  inputTotals: object,
  outputTotals: object
}

export interface MagellanOutput {
  id: string,
  amount: number,
  addresses: string[]
}

export interface MagellanInput {
  output: MagellanOutput,
  credentials: MagellanCredentials
}

export interface MagellanCredentials {
  address: string,
  public_key: string,
  signature: string
}

export function createTransaction(magellanTransaction: MagellanTransaction): XTransaction {
  console.log(magellanTransaction);
  return <XTransaction> {
    id: magellanTransaction.id,
    timestamp: new Date(Date.parse(magellanTransaction.timestamp)),
    type: magellanTransaction.type,
    from: getInputFunds(magellanTransaction),
    to: getOutputFunds(magellanTransaction),
    fee: magellanTransaction.txFee,
    inputTotals: magellanTransaction.inputTotals,
    outputTotals: magellanTransaction.outputTotals,
    status: 'accepted' //TODO: set dynamically when magellan delivers this information
  }
}

export function getOutputFunds(magellanTransaction: MagellanTransaction): Fund[] {
  const outputfunds: Fund[] = [];
  for (const output of magellanTransaction.outputs || []) {
    outputfunds.push(createFundFromOutput(output));
  }
  return outputfunds;
}

export function getInputFunds(magellanTransaction: MagellanTransaction): Fund[] {
  const inputfunds: Fund[] = [];
  if (magellanTransaction.inputs) {
    for (const input of magellanTransaction.inputs) {
      const inputFund = createFundFromOutput(input.output);
      inputFund.signature = input.credentials[0].signature;
      inputfunds.push(inputFund);
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
    async getChainId() : Promise<string>{
      if(!this.xChainId) {
        this.xChainId = await getChainId('x');
      }
      return this.xChainId
    },

    async loadLatestTransactions(offset = 0, count = 10): Promise<XTransaction[]> {
      console.log('loading', offset, count)
      const chainId = await this.getChainId();
      const rawTransactions: MagellanResponse = await (await axios.get(`${getMagellanBaseUrl()}${transactionApi}?chainID=${chainId}&limit=${offset+count}&sort=timestamp-desc`)).data;
      return rawTransactions.transactions.splice(offset, count).map(createTransaction);
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
