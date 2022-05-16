import axios from 'axios';
import { defineStore } from 'pinia';
import { CTransactionResponse, MagellanTransactionDetail } from 'src/types/magellan-types';
import { XPTransaction } from 'src/types/transaction';
import { getMagellanBaseUrl } from 'src/utils/client-utils';
import { cTransactionApi } from 'src/utils/magellan-api-utils';
import { useMagellanTxStore } from './magellan-tx-store';
import { assets, addresses } from 'src/utils/magellan-api-utils'
import { MagellanAssetsResponse, MagellanAddressResponse } from 'src/types/magellan-types'


export const useAddressStore = defineStore('address', {
  state: () => ({
    magellanStore: useMagellanTxStore(),
    caminoAssetId: undefined as string | undefined
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
        // normally shows method name and parameters. This cuts off the parameters
        return data.split('(')[0];
      } catch (e) {
        console.log('could not find method name, returning hex');
        return inputHex;
      }
    },
    async loadXpTransactions(address: string, chain: string, offset: number, limit: number): Promise<XPTransaction[]> {
      return this.magellanStore.loadTransactions(chain, address, offset, limit);
    },
    async loadCaminoAssetId(): Promise<string | undefined> {
      if (this.caminoAssetId) {
        return this.caminoAssetId;
      }
      const loadedAssets: MagellanAssetsResponse = await (await axios.get(`${getMagellanBaseUrl()}${assets}`)).data
      if (loadedAssets.assets) {
        const element = loadedAssets.assets.find(e => e.alias === 'CAM');
        if (element) {
          this.caminoAssetId = element.id;
        }
      }
      return this.caminoAssetId;
    },
    async loadCaminoBalance(address: string): Promise<string> {
      const caminoId = await this.loadCaminoAssetId();
      if (!caminoId) {
        return 'UNKNOWN';
      }
      const addressInfo: MagellanAddressResponse = await (await axios.get(`${getMagellanBaseUrl()}${addresses}/${address}`)).data
      if (addressInfo && addressInfo.assets[caminoId]) {
        return addressInfo.assets[caminoId].balance;
      }
      return 'UNKNOWN';
    }
  },
});
