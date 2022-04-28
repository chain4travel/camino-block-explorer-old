export interface Transaction {
  id: string;
  status?: string; // enum?
  block?: number;
  timestamp?: Date;
  from?: string;
  to?: string;
  value?: string;
}

export interface XTransaction {
  id: string;
  type: string;
  timestamp?: Date;
  from: Fund[];
  to: Fund[];
  fee: number;
}

export interface Fund {
  address: string;
  value?: number;
}
