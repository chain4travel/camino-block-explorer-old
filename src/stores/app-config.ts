import { defineStore } from 'pinia'
import { Network } from 'src/types/network'

export const useAppConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    activeNetwork: 'camino-local',
    networks: [
      {
        name: 'camino-mainnet',
        displayName: 'Camino MainNet',
        protocol: 'http',
        host: '127.0.0.1',
        port: 9650,
        predefined: true
      }, //TODO: changeme
      {
        name: 'camino-testnet',
        displayName: 'Camino TestNet',
        protocol: 'http',
        host: '127.0.0.1',
        port: 9650,
        predefined: true
      }, //TODO: changeme,
      {
        name: 'camino-local',
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
      this.customNetworks = this.customNetworks.filter((value) => {
        value.name !== name;
      });
    }
  }
})
