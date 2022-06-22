import axios from 'axios';
import { defineStore } from 'pinia';
import { BlockTableData } from 'src/types/block';
import { CTransaction } from 'src/types/transaction';
import { BlockDetails } from 'src/types/block';
import { getMagellanBaseUrl } from 'src/utils/client-utils';
import {
  cBlocksApi,
  cTransactionApi,
  cBlocksDetailsApi,
} from 'src/utils/magellan-api-utils';
import {
  MagellanCBlocksResponse,
  MagellanCTransactionResponse,
  MagellanBlockDetail,
  MagellanTransactionDetail,
} from 'src/types/magellan-types';
import { NodeValidatorsResponse } from 'src/types/node-types';

import { TranscationDetail } from 'src/types/transaction';
import { DateTime } from 'luxon';
import { Timeframe } from 'src/types/chain-loader';
import { getStartDate } from 'src/utils/date-utils';
import { usePIndexStore } from './p-index-store';
import { useMagellanTxStore } from 'src/stores/magellan-tx-store';

async function loadBlocksAndTransactions(
  startingBlock = NaN,
  endingBlock = NaN,
  transactionId = 0,
  blockCount = 10,
  transactionCount = 10
): Promise<MagellanCBlocksResponse> {
  return await (
    await axios.get(
      `${getMagellanBaseUrl()}${cBlocksApi}?limit=${blockCount}&limit=${transactionCount}&blockStart=${startingBlock}&blockEnd=${endingBlock}&transactionId=${transactionId}`
    )
  ).data;
}

// async function cTransactionsBetweenDates(start: DateTime, end: DateTime): Promise<MagellanTransactionDetail[]> {
//   //Query parameters are currently ignored, so manual filter needed at the end. Does not scale well!
//   const data: MagellanCTransactionResponse = await (await axios.get(`${getMagellanBaseUrl()}${cTransactionApi}?startTime=${start.toISO()}&endTime=${end.toISO()}`)).data;
//   const validInterval = Interval.fromDateTimes(start, end);
//   return data.Transactions.filter(item => {
//     return validInterval.contains(DateTime.fromJSDate(new Date(item.createdAt)))
//   });
// }

export const useCIndexStore = defineStore('cindex', {
  state: () => ({
    store: useMagellanTxStore(),
    pStore: usePIndexStore(),
  }),
  getters: {},
  actions: {
    async refreshAll(value: Timeframe) {
      this.store.gasFeesLoading = true;
      this.store.transactionsLoading = true;
      const [transactionAggregate, gasFeeAggregate, validators] =
        await Promise.all([
          this.loadNumberOfTransactions(value),
          this.loadTotalGasFess(value),
          this.getNumberOfValidators(),
        ]);
      this.store.numberOfActiveValidators =
        validators?.numberOfActiveValidators;
      this.store.numberOfValidators = validators?.numberOfValidators;

      this.store.numberOfTransactions = transactionAggregate || 0;
      this.store.totalGasFees = gasFeeAggregate || 0;
      this.store.gasFeesLoading = false;
      this.store.transactionsLoading = false;
    },
    async loadNumberOfTransactions(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionAggregates(
        'c',
        startDate.toISO(),
        currentDate.toISO()
      );
      return result && result.aggregates && result.aggregates.transactionCount;
    },
    async loadTotalGasFess(timeframe: Timeframe): Promise<number> {
      const currentDate = DateTime.now().setZone('utc');
      const startDate = getStartDate(currentDate, timeframe);
      const result = await this.store.loadTransactionFeesAggregates(
        'c',
        startDate.toISO(),
        currentDate.toISO()
      );
      return result && result.aggregates && parseInt(result.aggregates.txfee);
    },
    async getNumberOfValidators(): Promise<NodeValidatorsResponse> {
      return this.pStore.getNumberOfValidators();
    },
    async loadBlocks(blockStart = NaN, count = 10): Promise<BlockTableData[]> {
      try {
        const cBlockresponse = await loadBlocksAndTransactions(
          blockStart,
          NaN,
          0,
          count,
          0
        );
        if (!cBlockresponse.blocks) {
          return [];
        }
        if (!isNaN(blockStart) && cBlockresponse.blocks.length > 0) {
          cBlockresponse.blocks = cBlockresponse.blocks.slice(1);
        }
        return cBlockresponse.blocks.map(
          (block) =>
            <BlockTableData>{
              hash: block.hash,
              number: parseInt(block.number),
              timestamp: new Date(block.timestamp * 1000),
              gasLimit: parseInt(block.gasLimit),
              gasUsed: parseInt(block.gasUsed),
              numberOfTransactions: block.evmTx ? block.evmTx : 0,
              blockCost:
                parseInt(block.gasUsed) * parseInt(block.baseFeePerGas),
            }
        );
      } catch (e) {
        console.error(e);
        // todo add q notify as display of error! (or throw and let component deal with it)
        return [];
      }
    },
    async loadTransactions(
      startBlock = NaN,
      transactionId = 0,
      count = 10
    ): Promise<CTransaction[]> {
      // currently offset is not available "natively", so we add offset and count and skip the offset elements in processing
      // this does not work for more than 5k elements at once.. will need to adjust for that to work
      try {
        const cBlockresponse = await loadBlocksAndTransactions(
          startBlock,
          NaN,
          transactionId,
          0,
          count
        );
        if (!cBlockresponse.transactions) {
          return [];
        }
        if (!isNaN(startBlock) && cBlockresponse.transactions.length > 0) {
          cBlockresponse.transactions = cBlockresponse.transactions.slice(1);
        }
        return cBlockresponse.transactions.map(
          (element) =>
            <CTransaction>{
              block: parseInt(element.block),
              index: parseInt(element.index),
              from: element.from,
              hash: element.hash,
              status:
                parseInt(element.status) === 1
                  ? 'Success'
                  : `Failed-${parseInt(element.status)}`,
              timestamp: new Date(parseInt(element.timestamp) * 1000),
              to: element.to,
              value: parseInt(element.value),
              transactionCost:
                parseInt(element.gasUsed) * parseInt(element.effectiveGasPrice),
            }
        );
      } catch (e) {
        return [];
      }
    },
    async loadTransactionById(
      transactionId: string
    ): Promise<TranscationDetail> {
      const mglDetails: MagellanTransactionDetail = (
        await this.loadMagellanTransactionbyHash(transactionId)
      ).Transactions[0];
      return {
        block: mglDetails.block,
        contractAddress: mglDetails.receipt
          ? mglDetails.receipt.contractAddress
          : undefined,
        createdAt: new Date(mglDetails.createdAt),
        fromAddr: mglDetails.fromAddr,
        gasLimit: mglDetails.gasLimit,
        gasPrice: parseInt(mglDetails.gasPrice),
        gasUsed: mglDetails.receipt
          ? parseInt(mglDetails.receipt.gasUsed)
          : undefined,
        hash: mglDetails.hash,
        maxFeePerGas: parseInt(mglDetails.maxFeePerGas),
        maxPriorityFeePerGas: parseInt(mglDetails.maxPriorityFeePerGas),
        nonce: mglDetails.nonce,
        r: mglDetails.r,
        s: mglDetails.s,
        v: mglDetails.v,
        toAddr: mglDetails.toAddr,
        type: mglDetails.type,
        value: parseInt(mglDetails.value),
        transactionCost:
          parseInt(mglDetails.receipt.gasUsed) *
          parseInt(mglDetails.receipt.effectiveGasPrice),
        effectiveGasPrice: parseInt(mglDetails.receipt.effectiveGasPrice),
      };
    },
    async loadByBlockId(blockNumberParam: string): Promise<BlockDetails> {
      const blockNumber = parseInt(blockNumberParam);
      const block = await this.loadMagellanBlockByNumber(blockNumber);
      const detailBlock = {
        additionalInformation: {
          extraData: block.header.extraData,
        },
        blockNumber: parseInt(block.header.number),
        hash: block.header.hash,
        parentHash: block.header.parentHash,
        parentBlockNumber: parseInt(block.header.number)
          ? parseInt(block.header.number) - 1
          : undefined,
        fees: 0, //parseInt(block.header.gasUsed) * parseInt(block.header.baseFeePerGas), //We overwrite this field with the aggregated cost of transactions
        baseGaseFee: parseInt(block.header.baseFeePerGas),
        transactionCount: block.transactions ? block.transactions.length : 0,
        gasLimit: parseInt(block.header.gasLimit),
        gasUsed: parseInt(block.header.gasUsed),
        timestamp: new Date(parseInt(block.header.timestamp) * 1000),
        transactions: block.transactions
          ? block.transactions.map((item) => ({
              block: item.block,
              index: parseInt(item.receipt.transactionIndex),
              from: item.fromAddr,
              hash: item.hash,
              status: item.receipt.status,
              timestamp: new Date(item.createdAt),
              to: item.toAddr,
              transactionCost: item.receipt.gasUsed
                ? parseInt(item.receipt.gasUsed) *
                  parseInt(item.receipt.effectiveGasPrice)
                : parseInt(item.maxFeePerGas) *
                  parseInt(item.receipt.effectiveGasPrice),
              value: parseInt(item.value),
            }))
          : [],
      };
      detailBlock.fees += detailBlock.transactions
        .map((e) => e.transactionCost)
        .reduce((pv, cv) => pv + cv, 0);
      return detailBlock;
    },
    async loadMagellanTransactionbyHash(
      transactionHash: string
    ): Promise<MagellanCTransactionResponse> {
      return await (
        await axios.get(
          `${getMagellanBaseUrl()}${cTransactionApi}?hash=${transactionHash}`
        )
      ).data;
    },
    async loadMagellanBlockByNumber(
      blockNumber: number
    ): Promise<MagellanBlockDetail> {
      return await (
        await axios.get(
          `${getMagellanBaseUrl()}${cBlocksDetailsApi}/${blockNumber}`
        )
      ).data;
    },
  },
});
