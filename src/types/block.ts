export class Block {
    id: string;
    hash: string;
    height: number;
    transactions: number;
    timestamp: Date;
    burned: number;

    constructor(id: string, height: number, timestamp: Date) {
      this.id = id;
      this.height = height;
      this.timestamp = timestamp;
      this.hash="0xa43b3262d7b54029ef23ed0dcf5122383cea8a34688153190ef3fd21e51367df";
      this.burned=0.1;
      this.transactions=3;
    }
  }