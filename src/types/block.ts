export interface Block {
  id: string;
  hash: string;
  height: number;
  transactions: number;
  timestamp: Date;
  burned: number;
}
