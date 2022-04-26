export interface Transaction {
  hash?: string;
  status?: string; // enum?
  block?: number;
  timestamp?: Date;
  from?: string;
  to?: string;
  value?: string;
}
