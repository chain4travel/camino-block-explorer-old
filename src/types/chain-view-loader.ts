import { Block } from './block';
import { Transaction } from './transaction';

export interface ChainViewLoader {
  loadLatestBlocks(forceRefresh: boolean): Promise<Block[]>;
  loadLatestTransactions(forceRefresh: boolean): Promise<Transaction[]>;
}
