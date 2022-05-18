import { MagellanTransactionDetail } from "./magellan-types";

export interface ChainViewLoader {
  loadLatestBlocks<T>(limit: number, offset: number): Promise<T[]>;
  loadLatestTransactions<T>(limit: number, offset: number): Promise<T[]>;
  loadAllCTxsForAddress(address: string, offset: number, count: number): Promise<MagellanTransactionDetail[]>;
}
