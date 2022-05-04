<template>
  <q-page padding>
    <!-- content -->
    <div class="row q-mt-xl">
      <div class="col-12">
        <details-table :back-addr="backAddr" :load-data="loadTransactions" :require-load-more="requireLoadMore" :columns="columns"
          title="X-Transactions" :store="store" @row-clicked="(item) => rowEvent(item)">
        </details-table>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { ChainType } from 'src/types/chain-type';
import { getAllTransactionsPath, getBasePath, getTransactionDetailsPath } from 'src/utils/route-utils';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import { XTransaction, XTransactionTableData } from 'src/types/transaction'
import { getRelativeTime } from 'src/utils/display-utils';
import { getDisplayValue } from 'src/utils/currency-utils';
import { ChainViewLoader } from 'src/types/chain-view-loader';
import DetailsTable from '../components/DetailsTable.vue';
import {  useXIndexStore } from 'src/stores/x-index-store';

const columns = [
  {
    name: 'hash',
    label: 'Hash',
    field: 'hash',
    align: 'left'
  },
  {
    name: 'from',
    label: 'From',
    field: 'from',
    align: 'left'
  },
  {
    name: 'to',
    label: 'To',
    field: 'to',
    align: 'left'
  },
  {
    name: 'timestamp',
    label: 'Timestamp',
    field: (row: XTransactionTableData) => getRelativeTime(row.timestamp) + ' ago',
    align: 'left'
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left'
  },
  {
    value: 'value',
    label: 'Value',
    field: (row: XTransactionTableData) => getDisplayValue(row.value),
    align: 'left'
  },
  {
    value: 'fee',
    label: 'Fee',
    field: (row: XTransactionTableData) => getDisplayValue(row.fee),
    align: 'left'
  }
]

function getValue(outputTotal?: object, inputTotal?: object): number {
  console.log('outputs', outputTotal);
  console.log('inputTotal', inputTotal);
  const output = outputTotal ? Object.entries(outputTotal).map(([key, value]) => parseInt(value)).reduce((pv, cv) => pv + cv, 0) : 0;
  const input = inputTotal ? Object.entries(inputTotal).map(([key, value]) => parseInt(value)).reduce((pv, cv) => pv + cv, 0) : 0;
  return output - input;
}

function mapToTableData(transaction: XTransaction): XTransactionTableData {
  console.log('transaction', transaction)
  return {
    from: transaction.from.map(e => e.address).join(' '),
    hash: transaction.id,
    type: transaction.type,
    timestamp: transaction.timestamp,
    to: transaction.to.map(e => e.address).join(' '),
    value: getValue(transaction.outputTotals, transaction.inputTotals),
    fee: transaction.fee
  }
}

export default defineComponent({
  name: 'XChainBlocksAll',
  async setup() {
    const router = useRouter();
    let moreToLoad = true;
    return {
      store: useXIndexStore(),
      columns,
      backAddr: getBasePath(ChainType.X_CHAIN),
      rowEvent(item: XTransactionTableData) {
        router.push({ path: getTransactionDetailsPath(ChainType.X_CHAIN, item.hash), query: { back: getAllTransactionsPath(ChainType.X_CHAIN) } });
      },
      requireLoadMore(): boolean {
        return moreToLoad;
      },
      async loadTransactions(store: ChainViewLoader, knownHashes: string[], offset: number, limit: number) {
        const apiData: XTransaction[] = await store.loadLatestTransactions(offset, limit);
        console.log('api', apiData)
        const newData: XTransactionTableData[] = [];
        console.log('From api ', apiData)
        moreToLoad = false;
        apiData.map(mapToTableData).forEach(newTransaction => {
          if (!knownHashes.includes(newTransaction.hash)) {
            newData.push(newTransaction);
            knownHashes.push(newTransaction.hash);
            moreToLoad = true;
          }
        });
        console.log('mapped ', newData)
        return newData;
      }
    };
  },
  components: { DetailsTable }
})
</script>

<style scoped lang="sass">
*
  background: $background-card
  color: white
.my-sticky-dynamic
  /* height or max-height is important */
  height: 80vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #ffffff
    position: sticky
    z-index: 1

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
