export interface ChainViewLoader {
  loadLatestBlocks<T>(limit: number, offset: number): Promise<T[]>;
  loadLatestTransactions<T>(limit: number, offset: number): Promise<T[]>;
}
