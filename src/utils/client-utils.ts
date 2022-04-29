import Avalanche from 'avalanche';
import { useAppConfig } from 'src/stores/app-config';
import Web3 from 'web3';

export function getAvalancheClient() {
  const network = useAppConfig().getActive;
  return new Avalanche(network.host, network.port, network.protocol);
}

export function getMagellanBaseUrl(): string {
  return useAppConfig().getActive.magellanAddress;
}

export const getWeb3Client = () => {
  const network = useAppConfig().getActive;
  return new Web3(`${network.protocol}://${network.host}:${network.port}/ext/bc/C/rpc`)
}
