export interface CTransactionResponse {
  Transactions: CTransactionResponseElement[];
}

export interface CTransactionResponseElement {
  type: number;
  block: number;
  hash: string;
  createdAt: Date;
  nonce: number;
  gasPrice: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  gasLimit: number;
  blockGasUsed: number;
  blockGasLimit: number;
  blockNonce: number;
  blockHash?: string; // seems to be empty often
  recipient: string;
  value: string;
  toAddr: string, // seems to equal recipient??
  fromAddr: string;
  v: string;
  r: string;
  s: string;
  traces: CTransactionTrace[];
}


export interface CTransactionTrace {
  callType: string;
  to: string;
  from: string;
  type: string;
  gasUsed: string;
  gas: string;
  value: string;
}
