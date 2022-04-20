export class Transaction {
  hash: string;
  status: string; // enum?
  block: number;
  timestamp: EpochTimeStamp;
  originAdress: String;
  destinationAdress: String;
  value: number;
  fee: number;

  constructor(hash: string, status: string, block: number, timestamp: EpochTimeStamp, originAdress: String, destinationAdress: String, value: number, fee: number) {
    this.hash = hash;
    this.status = status;
    this.block = block;
    this.timestamp = timestamp;
    this.originAdress = originAdress;
    this.destinationAdress = destinationAdress;
    this.value = value;
    this.fee = fee;
  }
}
