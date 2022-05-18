<template>
  <div>
    <ChainOverviewCards :store="store"></ChainOverviewCards>
    <div class="row full-width justify-center">
      <!-- Latest Transactions-->
      <div class="col-12 q-pr-md q-pl-md">
        <x-transaction-list :type="chainType" :transactions="transactions"
          :show-all-link="getAllTransactionsPath(chainType)" @refresh="refreshTransactions"
          :detailsLinkFunction="getTransactionDetailsLink">
        </x-transaction-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import XTransactionList from 'src/components/XTransactionList.vue';
import { getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useXIndexStore } from 'src/stores/x-index-store'
import ChainOverviewCards from 'src/components/ChainOverviewCards.vue';

export default defineComponent({
  name: 'XChainPage',
  components: { XTransactionList, ChainOverviewCards },
  async setup(props, { emit }) {
    const pageSize = 10;
    const chainType = ChainType.X_CHAIN;
    const store = useXIndexStore();
    const transactions = ref(await store?.loadLatestTransactions(0, pageSize))

    return {
      store,
      pageSize,
      chainType,
      transactions,
      search(value: string) {
        emit('search', value);
      },
      async refreshTransactions() {
        transactions.value = await store?.loadLatestTransactions(0, pageSize)
      },
      getTransactionDetailsLink(item: string) {
        return getTransactionDetailsPath(chainType, item);
      },
      getAllBlocksPath,
      getAllTransactionsPath
    }
  }
})
</script>
