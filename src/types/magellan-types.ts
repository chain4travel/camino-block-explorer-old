export interface CTransactionResponse {
  Transactions: MagellanTransactionDetail[];
}

export interface MagellanCBlocksResponse {
  blockCount:number;
  transactionCount:number;
  blocks?: MagellanBlock[];
  transactions?: MagellanTransaction[];
}

export interface MagellanBlock {
  hash: string;
  miner: string;
  difficulty: string;
  number: string;
  gasLimit: string;
  gasUsed: string;
  timestamp: number;
  baseFeePerGas: string;
  extDataGasUsed: string;
  blockGasCost: string;
  evmTx?: number;
}


export interface MagellanTransaction {
  type: string;
  block: string;
  index: string;
  hash: string;
  nonce: string;
  gasPrice: string;
  gas: string;
  value: string;
  from: string;
  to: string;
  timestamp: string;
  status: string;
  gasUsed: string;
}

export interface MagellanTransactionDetail {
  type: number;
  block: number;
  hash: string;
  createdAt: Date;
  nonce: number;
  gasPrice: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  gasLimit: number;
  value: number;
  input: string;
  fromAddr: string;
  toAddr: string;
  v: string;
  r: string;
  s: string;
  receipt: MagellanTransactionReceipt
}

export interface MagellanTransactionReceipt {
  type: number;
  root: string;
  status: number;
  cumulativeGasUsed: number;
  logsBloom: string;
  logs: MagellanTransactionDetailLog [],
  transactionHash: string;
  contractAddress: string;
  gasUsed: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
}

export interface MagellanTransactionDetailLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;

}

export interface MagellanBlockDetail {
  header: {
    parentHash: string;
    sha3Uncles: string;
    miner: string;
    stateRoot: string;
    transactionsRoot: string;
    receiptsRoot: string;
    logsBloom: string;
    difficulty: string;
    number: string;
    gasLimit: string;
    gasUsed: string;
    timestamp: string;
    extraData: string;
    mixHash: string;
    nonce: string;
    extDataHash: string;
    baseFeePerGas: string;
    extDataGasUsed: string;
    blockGasCost: string;
    hash: string;
  },
  transactions: MagellanTransactionDetail[];
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
