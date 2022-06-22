export interface CTransaction {
  hash: string;
  status: string; // enum?
  block: number;
  index: number;
  timestamp: Date;
  from: string;
  to: string;
  value: number;
  transactionCost: number;
}

export interface XPTransaction {
  id: string;
  type: string;
  timestamp?: Date;
  from: Fund[];
  to: Fund[];
  fee: number;
  inputTotals: Record<string, string>;
  outputTotals: Record<string, string>;
  memo?: string;
}

export interface Fund {
  address: string;
  value?: number;
  signature?: string;
}

export interface TransactionTableData {
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  hash: string;
  status: string;
  value: number;
  timestamp: Date;
  transactionCost: number;
}

export interface XPTransactionTableData {
  from: Fund[];
  to: Fund[];
  hash: string;
  type: string;
  value: number;
  fee: number;
  timestamp?: Date;
}

export interface TranscationDetail {
  hash: string;
  type: number;
  block: number;
  createdAt: Date;
  nonce: number;
  gasPrice: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  gasLimit: number;
  value: number;
  fromAddr: string;
  toAddr: string;
  v: string;
  r: string;
  s: string;
  gasUsed?: number;
  contractAddress?: string;
  transactionCost: number;
  effectiveGasPrice: number;
}

export interface CAddressTransactionTableData {
  type: number;
  txnHash: string;
  block: number;
  age: Date;
  from: string;
  to: string;
  value: number;
  txnFee: number;
  direction: 'out' | 'in';
}
