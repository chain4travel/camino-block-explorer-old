import { Block } from './block';
import { CTransactionList } from './transaction';

export interface ChainViewLoader {
  loadLatestBlocks(forceRefresh: boolean, limit: number, offset: number): Promise<Block[]>;
  loadLatestTransactions(forceRefresh: boolean, limit: number, offset: number): Promise<CTransactionList>;
}
