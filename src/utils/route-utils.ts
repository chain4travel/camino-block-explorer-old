import { ChainType } from 'src/types/chain-type';

export const TRANSACTION_DETAILS_BASEPATH = '/transactions/';
const BLOCK_DETAILS_BASEPATH = '/blocks/';
const TRANSACTIONS_PATH_NAME = '-Transactions';
const BLOCKS_PATH_NAME = '-Blocks';
const ALL_PATH_NAME = '-All'

export function getTransactionDetailsPath(chaintype: ChainType, transactionId: string): string {
  const basePath = getBasePath(chaintype) + TRANSACTION_DETAILS_BASEPATH;
  if (transactionId) {
    return basePath + transactionId;
  }
  return basePath;
}

export function getBlockDetailsPath(chaintype: ChainType, blockId: string): string {
  const basePath = getBasePath(chaintype) + BLOCK_DETAILS_BASEPATH;
  if (blockId) {
    return basePath + blockId;
  }
  return basePath;
}

export function getPathName(chaintype: ChainType) {
  switch (chaintype) {
    case ChainType.C_CHAIN:
      return 'C-Chain';
    case ChainType.X_CHAIN:
      return 'X-Chain';
    case ChainType.P_CHAIN:
      return 'P-Chain';
  }
}

export function getTransactionsPathName(chaintype: ChainType) {
  return getPathName(chaintype) + TRANSACTIONS_PATH_NAME;
}

export function getBlockDetailsPathName(chaintype: ChainType) {
  return getPathName(chaintype) + BLOCKS_PATH_NAME;
}

export function getAllBlocksPath(chaintype: ChainType) {
  return getBasePath(chaintype) + '/all' + BLOCK_DETAILS_BASEPATH;
}

export function getAllBlocksPathName(chaintype: ChainType) {
  return getPathName(chaintype) + BLOCKS_PATH_NAME + ALL_PATH_NAME;
}

export function getAllTransactionsPath(chaintype: ChainType) {
  return getBasePath(chaintype) + '/all' + TRANSACTION_DETAILS_BASEPATH;
}

export function getAllTransactionsPathName(chaintype: ChainType) {
  return getPathName(chaintype) + TRANSACTIONS_PATH_NAME + ALL_PATH_NAME;
}


export function getBasePath(chaintype: ChainType): string {
  return '/' + chaintype.toLowerCase();
}
