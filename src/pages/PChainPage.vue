<template>
  <div class="row full-width">
    <!-- Latest Transactions-->
    <div class=" col-12 q-pr-md q-pl-md">
      <!-- Rename that component-->
      <x-transaction-list :show-type="true" :transactions="transactions"
        :show-all-link="getAllTransactionsPath(chainType)" @refresh="refreshTransactions"
        @row-clicked="openTransactionDetail">
      </x-transaction-list>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import XTransactionList from 'src/components/XTransactionList.vue';
import { useRouter } from 'vue-router';
import { getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { usePIndexStore } from 'src/stores/p-index-store'
import { XPTransaction } from 'src/types/transaction';

export default defineComponent({
  name: 'PChainPage',
  components: { XTransactionList },
  async setup() {
    const router = useRouter();
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
      openTransactionDetail(item: XPTransaction) {
        if (!item.id) {
          return;
        }
        router.push(getTransactionDetailsPath(chainType, item.id))
      },
      getAllBlocksPath,
      getAllTransactionsPath
    }
  }
})
</script>
