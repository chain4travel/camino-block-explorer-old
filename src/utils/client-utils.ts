import Avalanche from 'avalanche';
import axios from 'axios';
import { useAppConfig } from 'src/stores/app-config';
import Web3 from 'web3';
import { baseEndpoint } from './magellan-api-utils';

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

export const getChainId = async (alias: string) => {
  const response = await axios.get(getMagellanBaseUrl() + baseEndpoint)
  const data = await response.data;
  const value = Object.entries(data.chains).filter(([key, value]) => {
    return value.chainAlias === alias;
  });
  return value[0][0];
}
