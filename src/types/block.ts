export interface BlockTableData {
  number: number;
  timestamp: Date;
  numberOfTransactions: number;
  hash: string;
  gasUsed?: number;
  gasLimit?: number;
}
