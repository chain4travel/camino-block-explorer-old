import { defineStore } from 'pinia'
import { Network } from 'src/types/network'
import { useStorage } from '@vueuse/core'
import { Dark } from 'quasar'

export const useAppConfig = defineStore({
  id: 'appConfig',
  state: () => ({
    activeNetwork: useStorage('cam-explorer-active-network', 'camino-local'),
    networks: [
      // TODO Add Main net once available!
      {
        id: 'camino-testnet',
        displayName: 'Columbus Network',
        protocol: 'https',
        host: 'columbus.camino.foundation',
        magellanAddress: 'https://magellan.columbus.camino.foundation',
        port: 443,
        predefined: true
      },
    ] as Network[],
    customNetworks: useStorage('cam-explorer-custom-networks', [] as Network[]),
    darkMode: useStorage('cam-explorer-dark-mode', Dark.isActive as boolean),
  }),
  getters: {
    getAllNetworks(): Network[] {
      return this.networks.concat(this.customNetworks);
    },
    getActive(): Network {
      return this.getAllNetworks.find(network => network.id === this.activeNetwork) || this.networks[0];
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
