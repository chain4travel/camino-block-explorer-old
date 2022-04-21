import { defineStore } from 'pinia'
import type { I18n } from 'vue-i18n';
import { Network } from 'src/types/network'

export const useAppConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    activeNetwork: 'camino-local',
    networks: [
      new Network('camino-mainnet', 'Camino MainNet', 'http', '127.0.0.1', 9650, true), //TODO: changeme
      new Network('camino-testnet', 'Camino TestNet', 'http', '127.0.0.1', 9650, true), //TODO: changeme
      new Network('camino-local', 'Camino Local', 'http', '127.0.0.1', 9650, true),
    ],
    customNetworks: [] as Network[]
  }),
  getters: {
    getAllNetworks(): Network[] {
      return this.networks.concat(this.customNetworks);
    },
    getActive(): Network {
      return this.networks.find(network => network.name === this.activeNetwork) || this.networks[0];
    },
  },
  actions: {
    setActive(name: string): boolean {
      const newActiveNewtork = this.networks.find(network => network.name === name)
      if (newActiveNewtork) {
        this.activeNetwork = name;
        return true;
      } else {
        return false
      }
    },
    pushNetwork(network: Network) {
      this.customNetworks.push(network);
    },
    removeNetwork(name: string) {
      this.customNetworks = this.customNetworks.filter((value, index, arr) => {
        value.name !== name;
      });
    }
  }
})
