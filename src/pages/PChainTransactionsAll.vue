<template>
  <div class="row">
    <div class="col-12">
      <DetailsTable
        :back-addr="backAddr"
        :load-data="loadTransactions"
        :require-load-more="requireLoadMore"
        :columns="columns"
        title="P-Transactions"
        :store="store"
      >
      </DetailsTable>
    </div>
  </div>
</template>

<script lang="ts">
import { ChainType } from 'src/types/chain-type';
import {
  getAddressDetailsPath,
  getAllTransactionsPath,
  getOverviewPath,
  getTransactionDetailsPath,
} from 'src/utils/route-utils';
import { defineComponent } from 'vue';
import { XPTransaction, XPTransactionTableData } from 'src/types/transaction';
import { ChainLoader } from 'src/types/chain-loader';
import DetailsTable from '../components/DetailsTable.vue';
import { usePIndexStore } from 'src/stores/p-index-store';
import { getDisplayAddress } from 'src/utils/display-utils';

function getValue(outputTotal?: object, inputTotal?: object): number {
  const output = outputTotal
    ? Object.entries(outputTotal)
        .map(([, value]) => parseInt(value))
        .reduce((pv, cv) => pv + cv, 0)
    : 0;
  const input = inputTotal
    ? Object.entries(inputTotal)
        .map(([, value]) => parseInt(value))
        .reduce((pv, cv) => pv + cv, 0)
    : 0;
  return output - input;
}

function mapToTableData(transaction: XPTransaction): XPTransactionTableData {
  return {
    from: transaction.from,
    hash: transaction.id,
    type: transaction.type,
    timestamp: transaction.timestamp,
    to: transaction.to,
    // CUrrently not shown, discuss what to do here!
    value: getValue(transaction.outputTotals, transaction.inputTotals),
    fee: transaction.fee,
  };
}

function txDetailsLink(item: string) {
  return `${getTransactionDetailsPath(
    ChainType.P_CHAIN,
    item
  )}?back=${getAllTransactionsPath(ChainType.X_CHAIN)}`;
}

function addressDetails(item: string) {
  const firstAddress = item.split(' (')[0];
  return `${getAddressDetailsPath(
    'P-' + firstAddress
  )}?back=${getAllTransactionsPath(ChainType.X_CHAIN)}`;
}

export default defineComponent({
  name: 'PChainTransactionsAll',
  async setup() {
    let moreToLoad = true;
    return {
      store: usePIndexStore(),
      backAddr: getOverviewPath(ChainType.P_CHAIN),
      requireLoadMore(): boolean {
        return moreToLoad;
      },
      async loadTransactions(
        store: ChainLoader,
        knownHashes: string[],
        offset: number,
        limit: number
      ) {
        const apiData: XPTransaction[] = await store.loadTransactions(
          offset,
          limit
        );
        const newData: XPTransactionTableData[] = [];
        moreToLoad = false;
        apiData.map(mapToTableData).forEach((newTransaction) => {
          if (!knownHashes.includes(newTransaction.hash)) {
            newData.push(newTransaction);
            knownHashes.push(newTransaction.hash);
            moreToLoad = true;
          }
        });
        return newData;
      },
      columns: [
        {
          name: 'hash',
          label: 'Hash',
          field: 'hash',
          align: 'center',
          type: 'hash',
          detailsLink: txDetailsLink,
        },
        {
          name: 'from',
          label: 'From',
          field: (row: XPTransactionTableData) => getDisplayAddress(row.from),
          align: 'center',
          type: 'hash',
          detailsLink: addressDetails,
        },
        {
          name: 'to',
          label: 'To',
          field: (row: XPTransactionTableData) => getDisplayAddress(row.to),
          align: 'center',
          type: 'hash',
          detailsLink: addressDetails,
        },
        {
          name: 'timestamp',
          label: 'Timestamp',
          field: 'timestamp',
          align: 'center',
          type: 'timestamp',
        },
        {
          name: 'type',
          label: 'Type',
          field: 'type',
          align: 'center',
          type: 'status',
        },
        {
          value: 'fee',
          label: 'Fee',
          field: 'fee',
          align: 'center',
          type: 'currency',
        },
      ],
    };
  },
  components: { DetailsTable },
});
</script>
