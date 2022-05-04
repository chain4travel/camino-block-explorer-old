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
}
