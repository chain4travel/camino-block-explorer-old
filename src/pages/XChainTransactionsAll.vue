<template>
  <!-- content -->
  <div class="row q-mt-xl">
    <div class="col-12">
      <DetailsTable :back-addr="backAddr" :load-data="loadTransactions" :require-load-more="requireLoadMore"
        :columns="columns" title="X-Transactions" :store="store" @row-clicked="(item) => rowEvent(item)">
      </DetailsTable>
    </div>
  </div>
</template>

<script lang="ts">
import { ChainType } from 'src/types/chain-type';
import { getAllTransactionsPath, getOverviewPath, getTransactionDetailsPath } from 'src/utils/route-utils';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import { XPTransaction, XPTransactionTableData } from 'src/types/transaction'
import { getRelativeTime } from 'src/utils/display-utils';
import { getDisplayValue } from 'src/utils/currency-utils';
import { ChainLoader } from 'src/types/chain-loader';
import DetailsTable from '../components/DetailsTable.vue';
import { useXIndexStore } from 'src/stores/x-index-store';
import { getDisplayAddress } from 'src/utils/display-utils'

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
    field: (row: XPTransactionTableData) => getRelativeTime(row.timestamp) + ' ago',
    align: 'left',
    width: '120'
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left',
    width: '120'
  },
  {
    value: 'fee',
    label: 'Fee',
    field: (row: XPTransactionTableData) => getDisplayValue(row.fee),
    align: 'left',
    width: '150'
  }
]

function getValue(outputTotal?: object, inputTotal?: object): number {

  const output = outputTotal ? Object.entries(outputTotal).map(([key, value]) => parseInt(value)).reduce((pv, cv) => pv + cv, 0) : 0;
  const input = inputTotal ? Object.entries(inputTotal).map(([key, value]) => parseInt(value)).reduce((pv, cv) => pv + cv, 0) : 0;
  return output - input;
}

function mapToTableData(transaction: XPTransaction): XPTransactionTableData {
  return {
    from: getDisplayAddress(transaction.from),
    hash: transaction.id,
    type: transaction.type,
    timestamp: transaction.timestamp,
    to: getDisplayAddress(transaction.to),
    // Currently not shown, need to discuss what to show here
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
      backAddr: getOverviewPath(ChainType.X_CHAIN),
      rowEvent(item: XPTransactionTableData) {
        router.push({ path: getTransactionDetailsPath(ChainType.X_CHAIN, item.hash), query: { back: getAllTransactionsPath(ChainType.X_CHAIN) } });
      },
      requireLoadMore(): boolean {
        return moreToLoad;
      },
      async loadTransactions(store: ChainLoader, knownHashes: string[], offset: number, limit: number) {
        const apiData: XPTransaction[] = await store.loadTransactions(offset, limit);
        const newData: XPTransactionTableData[] = [];
        moreToLoad = false;
        apiData.map(mapToTableData).forEach(newTransaction => {
          if (!knownHashes.includes(newTransaction.hash)) {
            newData.push(newTransaction);
            knownHashes.push(newTransaction.hash);
            moreToLoad = true;
          }
        });
        return newData;
      }
    };
  },
  components: { DetailsTable }
})
</script>

<style scoped lang="sass">
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
