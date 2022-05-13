import axios from 'axios';
import { defineStore } from 'pinia';
import { CTransactionResponse, MagellanTransactionDetail } from 'src/types/magellan-types';
import { getMagellanBaseUrl } from 'src/utils/client-utils';
import { cTransactionApi } from 'src/utils/magellan-api-utils';


export const useAddressStore = defineStore('address', {
  state: () => ({
  }),
  getters: {
  },
  actions: {
    async loadAllCTxsForAddress(address: string, offset = 0, count = 10): Promise<MagellanTransactionDetail[]> {
      const fromAddressTxsPromise = axios.get(`${getMagellanBaseUrl()}${cTransactionApi}?fromAddress=${address}`)
      const toAddressTxsPromise = axios.get(`${getMagellanBaseUrl()}${cTransactionApi}?toAddress=${address}`)
      const [fromAddressTxs, toAddressTxs] = await Promise.all([fromAddressTxsPromise, toAddressTxsPromise])
      return [...(<CTransactionResponse>fromAddressTxs.data).Transactions, ...(<CTransactionResponse>toAddressTxs.data).Transactions]
    },
    // Returns decoded method name, or input id hex if not found
    async lookForMethodName(inputHex: string): Promise<string> {
      try {
        const data = await (await axios.get(`https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/${inputHex}`)).data
        return data.split('(')[0];
      } catch (e) {
        console.log('could not find method name, returning hex');
        return inputHex;
      }
    }
  },
});
