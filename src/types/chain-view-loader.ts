import { Block } from './block';
import { Transaction } from './transaction';

export interface ChainViewLoader {
  loadLatestBlocks(forceRefresh: boolean, limit: number, offset: number): Promise<Block[]>;
  loadLatestTransactions(forceRefresh: boolean, limit: number, offset: number): Promise<Transaction[]>;
}
