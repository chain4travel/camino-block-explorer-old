import { Block } from './block';
import { Transaction } from './transaction';

export interface ChainViewLoader {
  loadLatestBlocks(): Promise<Block[]>;
  loadLatestTransactions(): Promise<Transaction[]>;
}
