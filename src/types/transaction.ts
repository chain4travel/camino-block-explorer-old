export interface Transaction {
  hash: string;
  status: string; // enum?
  block: number;
  timestamp: EpochTimeStamp;
  originAdress: string;
  destinationAdress: string;
  value: number;
  fee: number;
}
