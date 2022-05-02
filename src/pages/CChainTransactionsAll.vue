<template>
  <q-page padding>
    <!-- content -->
    <div class="row q-mt-xl">
      <div class="offset-1 col-10">
        <details-table :load-data="loadTransactions" :require-load-more="requireLoadMore" :columns="columns" title="C-Blocks" :store="store" @row-clicked="(item) => rowEvent(item)">
        </details-table>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useCIndexStore } from 'src/stores/c-index-store';
import { ChainType } from 'src/types/chain-type';
import { getAllTransactionsPath, getTransactionDetailsPath } from 'src/utils/route-utils';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import { CTransaction, TransactionTableData } from 'src/types/transaction'
import { getRelativeTime } from 'src/utils/display-utils';
import { getDisplayValue } from 'src/utils/currency-utils';
import { ChainViewLoader } from 'src/types/chain-view-loader';
import DetailsTable from '../components/DetailsTable.vue';

const columns = [
  {
    name: 'blockNumber',
    label: 'Block',
    field: 'blockNumber'
  },
  {
    name: 'from',
    label: 'From',
    field: 'from',
  },
  {
    name: 'to',
    label: 'To',
    field: 'to'
  },
  {
    name: 'hash',
    label: 'Hash',
    field: 'hash'
  },
  {
    name: 'timestamp',
    label: 'Timestamp',
    field: (row: TransactionTableData) => getRelativeTime(row.timestamp),
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status'
  },
  {
    value: 'value',
    label: 'Value',
    field: (row: TransactionTableData) => getDisplayValue(row.value),
  }
]

function mapToTableData(transaction: CTransaction): TransactionTableData {
  return {
    blockNumber: transaction.block,
    from: transaction.from,
    hash: transaction.hash,
    status: transaction.status,
    timestamp: transaction.timestamp,
    to: transaction.to,
    value: transaction.value
  }
}

export default defineComponent({
    name: 'CChainBlocksAll',
    async setup() {
        const router = useRouter();
        let moreToLoad = true;
        return {
            store: useCIndexStore(),
            columns,
            rowEvent(item: TransactionTableData) {
                router.push({ path: getTransactionDetailsPath(ChainType.C_CHAIN, item.hash), query: { back: getAllTransactionsPath(ChainType.C_CHAIN) } });
            },
            requireLoadMore(): boolean {
                return moreToLoad;
            },
            async loadTransactions(store: ChainViewLoader, knownHashes: string[], offset: number, limit: number) {
                console.log('on scroll');
                const apiData = await store.loadLatestTransactions(true, offset, limit);
                const newData: TransactionTableData[] = [];
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
