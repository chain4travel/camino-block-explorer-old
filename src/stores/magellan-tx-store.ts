import { defineStore } from 'pinia';

import { XPTransaction, Fund } from 'src/types/transaction';
import { MagellanXPTransactionResponse, MagellanXPTransaction, MagellanXPOutput, MagellanAggregatesResponse, MagellanTxFeeAggregatesResponse } from 'src/types/magellan-types';
import axios from 'axios';
import { transactionAggregates, transactionApi, transactionFeeAggregates } from 'src/utils/magellan-api-utils';

import { getChainId, getMagellanBaseUrl } from 'src/utils/client-utils';


function sortByAddress(a: Fund, b: Fund): number {
  return a.address.localeCompare(b.address);
}

function convertMemo(memo: string): string {
  try {
    // decode base64 string including special characters
    return decodeURIComponent(escape(memo));
  } catch (e) {
    console.log('Memo was not base64 encoded, using raw value');
    return memo;
  }
}

export function createTransaction(magellanTransaction: MagellanXPTransaction): XPTransaction {
  return <XPTransaction>{
    id: magellanTransaction.id,
    timestamp: new Date(Date.parse(magellanTransaction.timestamp)),
    type: magellanTransaction.type,
    from: getInputFunds(magellanTransaction),
    to: getOutputFunds(magellanTransaction),
    fee: magellanTransaction.txFee,
    inputTotals: magellanTransaction.inputTotals,
    outputTotals: magellanTransaction.outputTotals,
    status: 'accepted', //TODO: set dynamically when magellan delivers this information
    memo: convertMemo(magellanTransaction.memo)
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
  return <Fund>{
    address: magellanOutput && magellanOutput.addresses ? magellanOutput.addresses[0] : null,
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
    async getChainId(chainAlias: string): Promise<string> {
      if (!this.chainIds[chainAlias]) {
        this.chainIds[chainAlias] = await getChainId(chainAlias);
      }
      return this.chainIds[chainAlias]
    },

    async loadLatestTransactions(chainAlias: string, offset = 0, limit = 10): Promise<XPTransaction[]> {
      return this.loadTransactions(chainAlias, null, offset, limit);
    },

    async loadTransactionById(transactionId: string): Promise<XPTransaction> {
      const rawTransaction = await axios.get(getMagellanBaseUrl() + transactionApi + '/' + transactionId);
      return Promise.resolve(createTransaction(rawTransaction.data))
    },

    async loadTransactions(chainAlias: string, address: string | null, offset = 0, limit = 10): Promise<XPTransaction[]> {
      const chainId = await this.getChainId(chainAlias);
      let url = `${getMagellanBaseUrl()}${transactionApi}?chainID=${chainId}&offset=${offset}&limit=${limit}&sort=timestamp-desc`
      if (address) {
        url += `&address=${address}`
      }
      const rawTransactions: MagellanXPTransactionResponse = await (await axios.get(url)).data;
      return rawTransactions.transactions ? rawTransactions.transactions.map(createTransaction) : [];
    },

    /**
     * Returns the aggregated information of transactions
     *
     * @param chainAlias the chain alias in magellan, currently x and p are supported
     * @param startTime the start time used while aggregating formatted as ISO date (e.g. 2022-02-21T00:00:00Z)
     * @param endTime the end time used while aggregating formatted as ISO date (e.g. 2022-02-21T00:00:00Z)
     */
    async loadTransactionAggregates(chainAlias: string, startTime: string, endTime: string): Promise<MagellanAggregatesResponse> {
      const chainId = await this.getChainId(chainAlias);
      const url = `${getMagellanBaseUrl()}${transactionAggregates}?chainID=${chainId}&startTime=${startTime}&endTime=${endTime}`
      return (await axios.get(url)).data;
    },

    /**
 * Returns the aggregated information of transactions
 *
 * @param chainAlias the chain alias in magellan, currently x and p are supported
 * @param startTime the start time used while aggregating formatted as ISO date (e.g. 2022-02-21T00:00:00Z)
 * @param endTime the end time used while aggregating formatted as ISO date (e.g. 2022-02-21T00:00:00Z)
 */
    async loadTransactionFeesAggregates(chainAlias: string, startTime: string, endTime: string): Promise<MagellanTxFeeAggregatesResponse> {
      const chainId = await this.getChainId(chainAlias);
      const url = `${getMagellanBaseUrl()}${transactionFeeAggregates}?chainID=${chainId}&startTime=${startTime}&endTime=${endTime}`
      return (await axios.get(url)).data;
    }

  },
});
