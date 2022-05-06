import { defineStore } from 'pinia';

import { XPTransaction, Fund } from 'src/types/transaction';
import { MagellanXPTransactionResponse, MagellanXPTransaction, MagellanXPOutput } from 'src/types/magellan-types';
import axios from 'axios';
import {  transactionApi } from 'src/utils/magellan-api-utils';

import { getChainId, getMagellanBaseUrl } from 'src/utils/client-utils';


function sortByAddress(a : Fund,b: Fund) : number {
  return a.address.localeCompare(b.address);
}

export function createTransaction(magellanTransaction: MagellanXPTransaction): XPTransaction {
  return <XPTransaction> {
    id: magellanTransaction.id,
    timestamp: new Date(Date.parse(magellanTransaction.timestamp)),
    type: magellanTransaction.type,
    from: getInputFunds(magellanTransaction),
    to: getOutputFunds(magellanTransaction),
    fee: magellanTransaction.txFee,
    inputTotals: magellanTransaction.inputTotals,
    outputTotals: magellanTransaction.outputTotals,
    status: 'accepted', //TODO: set dynamically when magellan delivers this information
    memo: magellanTransaction.memo,
  }
}

export function getOutputFunds(magellanTransaction: MagellanXPTransaction): Fund[] {
  const outputfunds: Fund[] = [];
  for (const output of magellanTransaction.outputs || []) {
    outputfunds.push(createFundFromOutput(output));
  }
  return outputfunds.sort(sortByAddress);
}

export function getInputFunds(magellanTransaction: MagellanXPTransaction): Fund[] {
  const inputfunds: Fund[] = [];
  if (magellanTransaction.inputs) {
    for (const input of magellanTransaction.inputs) {
      const inputFund = createFundFromOutput(input.output);
      inputFund.signature = input.credentials[0].signature;
      inputfunds.push(inputFund);
    }
  }
  return inputfunds.sort(sortByAddress);
}

function createFundFromOutput(magellanOutput: MagellanXPOutput): Fund {
  return <Fund> {
    address: magellanOutput.addresses[0],
    value: magellanOutput.amount
  }
}

export const useMagellanTxStore = defineStore('magellan-tx-store', {
  state: () => ({
    chainIds: {} as Record<string, string>
  }),
  getters: {
  },
  actions: {
    async getChainId(chainAlias: string) : Promise<string>{
      if(!this.chainIds[chainAlias]) {
        this.chainIds[chainAlias] = await getChainId(chainAlias);
      }
      return this.chainIds[chainAlias]
    },

    async loadLatestTransactions(chainAlias: string, offset = 0, count = 10): Promise<XPTransaction[]> {
      const chainId = await this.getChainId(chainAlias);
      const rawTransactions: MagellanXPTransactionResponse = await (await axios.get(`${getMagellanBaseUrl()}${transactionApi}?chainID=${chainId}&limit=${offset+count}&sort=timestamp-desc`)).data;
      return rawTransactions.transactions.splice(offset, count).map(createTransaction);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      // if (import.meta.env.DEV) {
      //   const mock = createMockTransaction(1);
      //   mock.hash = transactionId;
      //   return Promise.resolve(mock);
      // }
      const rawTransaction = await axios.get(getMagellanBaseUrl() + transactionApi + '/' + transactionId);
      return Promise.resolve(createTransaction(rawTransaction.data))
    },
  },
});
