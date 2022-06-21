import { MagellanTransactionDetail } from './magellan-types';

export interface ChainLoader {
  loadLatestBlocks<T>(limit: number, offset: number): Promise<T[]>;
  loadLatestTransactions<T>(limit: number, offset: number): Promise<T[]>;
  loadAllCTxsForAddress(
    address: string,
    offset: number,
    count: number
  ): Promise<MagellanTransactionDetail[]>;
}

export interface ChainOverviewLoader {
  getNumberOfValidators(): Promise<number>;
  loadNumberOfTransactions(timeframe: Timeframe): Promise<number>;
  loadTotalGasFess(timeframe: Timeframe): Promise<number>;
}

export enum Timeframe {
  HOURS_24 = 'HOURS_24',
  DAYS_7 = 'DAYS_7',
  MONTHS_1 = 'MONTHS_1',
}

export function getLabel(timeframe: Timeframe) {
  switch (timeframe) {
    case Timeframe.HOURS_24:
      return '24 Hours';
    case Timeframe.DAYS_7:
      return '7 Days';
    case Timeframe.MONTHS_1:
      return '1 Month';
    default:
      return 'UNKNOWN';
  }
}
