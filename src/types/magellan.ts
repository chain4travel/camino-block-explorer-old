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
  type: number;
  block: number;
  index: number;
  hash: string;
  nonce: number;
  gasPrice: number;
  gas: number;
  value: number;
  from: string;
  to: string;
  timestamp: number;
  status: number;
  gasUsed: number;
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
    difficulty: number;
    number: number;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
    extraData: string;
    mixHash: string;
    nonce: number;
    extDataHash: string;
    baseFeePerGas: number;
    extDataGasUsed: number;
    blockGasCost: number;
    hash: string;
  },
  transactions: MagellanTransactionDetail[];
}
