import { ChainType } from 'src/types/chain-type';

export const CHAIN_OVERVIEW = 'chain-overview';
export const DETAILS = 'details';
export const TABLES = 'all';

const transactions = 'transactions';
const blocks = 'blocks';
const address = 'address';

export function getPathElement(type: ChainType): string {
  return type.toLowerCase();
}

export function getTransactionDetailsPath(
  chaintype: ChainType,
  transactionId: string
): string {
  const basePath = `/${DETAILS}/${transactions}/${getPathElement(chaintype)}/`;
  if (transactionId) {
    return basePath + transactionId;
  }
  return basePath;
}

export function getAddressDetailsPath(addressId: string): string {
  return `/${DETAILS}/${address}/${addressId}`;
}

export function getBlockDetailsPath(
  chaintype: ChainType,
  blockId: string | number
): string {
  const basePath = `/${DETAILS}/${blocks}/${getPathElement(chaintype)}/`;
  if (blockId !== undefined) {
    return basePath + blockId;
  }
  return basePath;
}

export function getOverviewPath(chaintype: ChainType) {
  return `/${CHAIN_OVERVIEW}/${getPathElement(chaintype)}`;
}

export function getAllBlocksPath(chaintype: ChainType) {
  return `/${TABLES}/${getPathElement(chaintype)}/${blocks}`;
}

export function getAllTransactionsPath(chaintype: ChainType) {
  return `/${TABLES}/${getPathElement(chaintype)}/${transactions}`;
}

export function getOverviewPathName(chaintype: ChainType) {
  return `${chaintype}-${CHAIN_OVERVIEW}`;
}

export function getTransactionsPathName(chaintype: ChainType) {
  return `${chaintype}-${transactions}-${DETAILS}`;
}

export function getBlockDetailsPathName(chaintype: ChainType) {
  return `${chaintype}-${blocks}-${DETAILS}`;
}

export function getAllBlocksPathName(chaintype: ChainType) {
  return `${chaintype}-${blocks}-${TABLES}`;
}

export function getAllTransactionsPathName(chaintype: ChainType) {
  return `${chaintype}-${transactions}-${TABLES}`;
}

export function makeSingleNetworkRoute(network: string) {
  if (!network)
    return {
      path: network,
      redirect: { name: getOverviewPathName(ChainType.C_CHAIN) },
      name: 'index',
    };
  return {
    path: network,
    redirect: { name: getOverviewPathName(ChainType.C_CHAIN) },
  };
}
