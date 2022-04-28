export interface CTransactionList {
  transactions: CTransaction[];
  hasMore: boolean;
}

export interface CTransaction {
  hash: string;
  status: string; // enum?
  block: number;
  timestamp: Date;
  from: string;
  to: string;
  value: string;
}

export interface XTransaction {
  id: string;
  type: string;
  timestamp?: Date;
  from: Fund[];
  to: Fund[];
  fee: number;
}

export interface Fund {
  address: string;
  value?: number;
}


export interface TransactionTableData {
  blockNumber: number;
  from: string;
  to: string;
  hash: string;
  status: string;
  value: string;
  timestamp: Date;
}
