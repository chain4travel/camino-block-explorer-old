export class Block {
  id: string;
  hash: string;
  height: number;
  transactions: number;
  timestamp: Date;
  burned: number;

  constructor(id: string, height: number, timestamp: Date, hash: string, burned: number, transactions: number) {
    this.id = id;
    this.height = height;
    this.timestamp = timestamp;
    this.hash = hash;
    this.burned = burned;
    this.transactions = transactions;
  }
}