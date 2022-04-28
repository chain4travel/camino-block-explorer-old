export interface Block {
  id: string;
  hash: string;
  height: number;
  timestamp: Date;
  parentHash?: string;
  baseFeePerGas?: number;
  nonce?: string;
  sha3Uncles?: string;
  logsBloom?: string;
  transactionsRoot?: string;
  stateRoot?: string;
  miner?: string;
  difficulty?: number;
  totalDifficulty?: number;
  size?: number;
  extraData?: string;
  gasLimit?: number;
  gasUsed?: number
  transactions?: string[],
  uncles?: string[]
}


export interface BlockTableData {
  id: string,
  height: number;
  timestamp: Date;
  numberOfTransactions: number;
  hash: string;
  gasUsed?: number;
  gasLimit?: number;
}
