export interface BlockDetails {
  blockNumber: number;
  timestamp: Date;
  transactionCount: number; //
  fees: number;
  gasUsed: number;
  gasLimit: number;
  baseGaseFee?: number;
  hash: string;
  parentHash: string;
  childHash?: string;
  additionalInformation: AdditionalInformation,
  parentBlockNumber?: number;
 childBlockNumber?: number;
}

interface AdditionalInformation {
  nonce?: number;
  difficulty?: number;
  extraData?: string;
  uncles?: string;
  logsBloom?: string;
}
