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

export interface MagellanXPTransactionResponse {
  transactions: MagellanXPTransaction[];
  startTime: string;
  endTime: string;
}

export interface MagellanXPTransaction {
  id: string;
  timestamp: string;
  inputs: MagellanXPInput[];
  outputs: MagellanXPOutput[];
  txFee: number;
  type: string;
  chainID: string;
  inputTotals: object,
  outputTotals: object,
  memo: string
}

export interface MagellanXPOutput {
  id: string,
  amount: number,
  addresses: string[]
}

export interface MagellanXPInput {
  output: MagellanXPOutput,
  credentials: MagellanXPCredentials[]
}

export interface MagellanXPCredentials {
  address: string,
  public_key: string,
  signature: string
}
