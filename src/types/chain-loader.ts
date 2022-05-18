export interface ChainLoader {
  loadBlocks<T>(limit: number, offset: number): Promise<T[]>;
  loadTransactions<T>(limit: number, offset: number): Promise<T[]>;
}
