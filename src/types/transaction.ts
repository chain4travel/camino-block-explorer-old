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
  inputTotals: Record<string, string>
  outputTotals: Record<string, string>
}

export interface Fund {
  address: string;
  value?: number;
  signature?: string;
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

export interface XTransactionTableData {
  from: string;
  to: string;
  hash: string;
  type: string;
  value: number;
  fee: number;
  timestamp?: Date;
}
