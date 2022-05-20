<template>
  <!-- content -->
  <div class="row">
    <div class="col-12">
      <DetailsTable :back-addr="backAddr" :load-data="loadTransactions" :require-load-more="requireLoadMore"
        :columns="columns" title="C-Transaction" :store="store">
      </DetailsTable>
    </div>
  </div>
</template>

<script lang="ts">
import { useCIndexStore } from 'src/stores/c-index-store';
import { ChainType } from 'src/types/chain-type';
import { getAllTransactionsPath, getOverviewPath, getTransactionDetailsPath, getAddressDetailsPath, getBlockDetailsPath } from 'src/utils/route-utils';
import { defineComponent } from 'vue'
import { CTransaction, TransactionTableData } from 'src/types/transaction'
import { getRelativeTime } from 'src/utils/display-utils';
import { getDisplayValue } from 'src/utils/currency-utils';
import { ChainLoader } from 'src/types/chain-loader';
import DetailsTable from '../components/DetailsTable.vue';

function mapToTableData(transaction: CTransaction): TransactionTableData {
  return {
    blockNumber: transaction.block,
    from: transaction.from,
    hash: transaction.hash,
    status: transaction.status,
    timestamp: transaction.timestamp,
    to: transaction.to,
    value: transaction.value,
    transactionCost: transaction.transactionCost
  }
}

export default defineComponent({
  name: 'CChainTransactionsAll',
  async setup() {

    function transactionDetails(item: string) {
      return `${getTransactionDetailsPath(ChainType.C_CHAIN, item)}?back=${getAllTransactionsPath(ChainType.C_CHAIN)}`
    }
    function addressDetails(item: string) {
      return `${getAddressDetailsPath(item)}?back=${getAllTransactionsPath(ChainType.C_CHAIN)}`
    }
    function blockDetails(item: string) {
      return `${getBlockDetailsPath(ChainType.C_CHAIN, item)}?back=${getAllTransactionsPath(ChainType.C_CHAIN)}`
    }
    let moreToLoad = true;
    return {
      store: useCIndexStore(),
      backAddr: getOverviewPath(ChainType.C_CHAIN),
      requireLoadMore(): boolean {
        return moreToLoad;
      },
      async loadTransactions(store: ChainLoader, knownHashes: string[], offset: number, limit: number) {
        const apiData: CTransaction[] = await store.loadTransactions(offset, limit);
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
      },
      columns: [
        {
          name: 'blockNumber',
          label: 'Block',
          field: 'blockNumber',
          align: 'left',
          type: 'hash',
          detailsLink: blockDetails
        },
        {
          name: 'from',
          label: 'From',
          field: 'from',
          align: 'left',
          type: 'hash',
          detailsLink: addressDetails
        },
        {
          name: 'to',
          label: 'To',
          field: 'to',
          align: 'left',
          type: 'hash',
          detailsLink: addressDetails
        },
        {
          name: 'hash',
          label: 'Hash',
          field: 'hash',
          align: 'left',
          type: 'hash',
          detailsLink: transactionDetails
        },
       {
          name: 'timestamp',
          label: 'Timestamp',
          field: 'timestamp',
          align: 'left',
          type: 'timestamp'
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'left',
          type: 'status'
        },
        {
          value: 'value',
          label: 'Value',
          field: (row: TransactionTableData) => getDisplayValue(row.value),
          align: 'left',
          type: 'currency'
        }
      ]
    };
  },
  components: { DetailsTable }
})
</script>
