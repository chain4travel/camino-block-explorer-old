import { Block } from 'src/types/block';
import { Transaction } from 'src/types/transaction';


function createHash() {
  return [...Array(66)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function createMockBlock(offset: number, index: number): Block {

  return {
    id: (offset + index) + '',
    hash: createHash(),
    burned: Math.random() * 21000,
    height: offset + index,
    timestamp: new Date(),
    transactions: Math.random() * 50
  }
}


export function createMockTransaction(offset: number): Transaction {
  const fee = Math.random() * 21000;
  return {
    originAdress: createHash(),
    destinationAdress: createHash(),
    block: offset + 1,
    hash: createHash(),
    fee,
    status: Math.random() > 0.95 ? 'fail' : 'success',
    value: fee + Math.random() * 50000,
    timestamp: Date.now()
  }
}
