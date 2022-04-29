<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table class="my-sticky-dynamic" title="C-Transactions" :rows="data" :columns="columns" :loading="loading"
        row-key="index" virtual-scroll :virtual-scroll-item-size="48" :virtual-scroll-sticky-size-start="48"
        :rows-per-page-options="[0]" @virtual-scroll="onScroll"
        @row-click="(event, item) => rowEvent(item)">
        <template v-slot:top-right>
          <q-btn color="primary" icon="mdi-refresh" @click="() => refresh()" />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useCIndexStore } from 'src/stores/c-index-store';
import { ChainType } from 'src/types/chain-type';
import { getAllTransactionsPath, getTransactionDetailsPath } from 'src/utils/route-utils';
import { defineComponent, Ref, ref } from 'vue'
import { useRouter } from 'vue-router';
import { CTransaction, TransactionTableData } from 'src/types/transaction'
import { getRelativeTime } from 'src/utils/display-utils';
import { getDisplayValue } from 'src/utils/currency-utils';

const pageSize=10;

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
    const store = useCIndexStore();
    const data: Ref<TransactionTableData[]> = ref([])
    let lastResponse: CTransactionList | undefined = undefined;
    const currentOffset = ref(0);
    const loading = ref(false);
    const moreToLoad = ref(true);
    let knownHashes: string[] = []
    return {
      columns,
      data,
      loading,
      pagination: { rowsPerPage: 0 },
      rowEvent(item: TransactionTableData) {
        console.log(item);
        router.push({ path: getTransactionDetailsPath(ChainType.C_CHAIN, item.hash), query: { back: getAllTransactionsPath(ChainType.C_CHAIN) } })
      },
      async refresh() {
        loading.value = true;
        currentOffset.value = 0;
        knownHashes = [];
        const newData :TransactionTableData[] = []
        lastResponse = await store.loadLatestTransactions(true, currentOffset.value, pageSize);
        currentOffset.value += lastResponse.length;
        lastResponse.map(mapToTableData).forEach(newBlock => {
          if (!knownHashes.includes(newBlock.hash)) {
            newData.push(newBlock);
            knownHashes.push(newBlock.hash);
          }
        })
        data.value = newData;
        loading.value = false;
      },
      async onScroll({ to }: { to: number }) {
        const lastIndex = data.value.length - 1;

        if (loading.value !== true && to === lastIndex && moreToLoad) {
          loading.value = true;
          moreToLoad.value = false;
          lastResponse = await store.loadLatestTransactions(true, currentOffset.value, pageSize);
          currentOffset.value += lastResponse.length;
          lastResponse.map(mapToTableData).forEach(newTransaction => {
            if (!knownHashes.includes(newTransaction.hash)) {
              data.value.push(newTransaction);
              knownHashes.push(newTransaction.hash);
              moreToLoad.value = true
            }
          })
          loading.value = false;
        }
      }
    }
  }
})
</script>

<style scoped lang="sass">
*
  background: #27324C
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
