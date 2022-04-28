export interface BlockDetails {
  blockNumber: number;
  timestamp: Date;
  transactionCount: number; //
  fees: number;
  size: number;
  gasUsed: number;
  gasLimit: number;
  baseGaseFee?: number;
  hash: string;
  parentHash: string;
  childHash?: string;
  additionalInformation: AdditionalInformation
}

interface AdditionalInformation {
  nonce: string;
  difficulty: number;
  totalDifficulty: number;
  extraData: string;
  uncles: string[];
  logsBloom: string;
}
