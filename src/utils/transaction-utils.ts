import { ChainType } from 'src/types/chain-type';
import { getTransactionDetailsPath } from 'src/utils/route-utils';

export function getTransactionIndex(transaction: any, store: any) {
  const index = store.findIndex((t: any) => t.hash === transaction.hash);
  return index;
}

export function getNextPrevPath(store: any, index: number, next: boolean) {
  if (next) {
    return getTransactionDetailsPath(ChainType.C_CHAIN, store[index + 1].hash);
  } else {
    return getTransactionDetailsPath(ChainType.C_CHAIN, store[index - 1].hash);
  }
}
