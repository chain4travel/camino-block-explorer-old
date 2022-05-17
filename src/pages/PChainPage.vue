<template>
  <div class="row full-width">
    <!-- Latest Transactions-->
    <div class=" col-12 q-pr-md q-pl-md">
      <!-- Rename that component-->
      <XTransactionList :show-type="true" :transactions="transactions"
        :show-all-link="getAllTransactionsPath(chainType)" @refresh="refreshTransactions" :detailsLinkFunction="getTransactionDetailsLink" >
      </XTransactionList>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import XTransactionList from 'src/components/XTransactionList.vue';
import { getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { usePIndexStore } from 'src/stores/p-index-store'

export default defineComponent({
  name: 'PChainPage',
  components: { XTransactionList },
  async setup() {
    const pageSize = 10;
    const chainType = ChainType.P_CHAIN;
    const store = usePIndexStore();
    const transactions = ref(await store?.loadLatestTransactions(0, pageSize))

    return {
      store,
      pageSize,
      chainType,
      transactions,
      search(value: string) {
        console.log('PChain Page search', value)
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
