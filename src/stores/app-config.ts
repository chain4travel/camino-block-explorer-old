import { defineStore } from 'pinia'
import { Network } from 'src/types/network'

export const useAppConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    activeNetwork: 'camino-local',
    networks: [
      {
        id: 'camino-mainnet',
        displayName: 'Camino MainNet',
        protocol: 'http',
        host: '127.0.0.1',
        port: 9650,
        predefined: true
      }, //TODO: changeme
      {
        id: 'camino-testnet',
        displayName: 'Camino TestNet',
        protocol: 'http',
        host: '127.0.0.1',
        port: 9650,
        predefined: true
      }, //TODO: changeme,
      {
        id: 'camino-local',
        displayName: 'Camino Local',
        protocol: 'http',
        host: '127.0.0.1',
        port: 9650,
        predefined: true
      },
    ] as Network[],
    customNetworks: [] as Network[]
  }),
  getters: {
    getAllNetworks(): Network[] {
      return this.networks.concat(this.customNetworks);
    },
    getActive(): Network {
      return this.networks.find(network => network.id === this.activeNetwork) || this.networks[0];
    },
  },
  actions: {
    setActive(id: string): boolean {
      const newActiveNewtork = this.getAllNetworks.find(network => network.id === id)
      if (newActiveNewtork) {
        this.activeNetwork = id;
        return true;
      } else {
        return false
      }
    },
    pushNetwork(network: Network) {
      this.customNetworks.push(network);
    },
    removeNetwork(id: string) {
      this.customNetworks = this.customNetworks.filter((value) => {
        return value.id !== id;
      });
    }
  }
})
