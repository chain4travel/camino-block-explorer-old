export interface BlockDetails {
  blockNumber: number;
  timestamp: Date;
  transactionCount: number;
  fees: number;
  gasUsed: number;
  gasLimit: number;
  baseGaseFee?: number;
  hash: string;
  parentHash: string;
  additionalInformation: AdditionalInformation,
  parentBlockNumber?: number;
}

interface AdditionalInformation {
  extraData?: string;
}
