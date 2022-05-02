<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col">
        <search-banner @search="search"></search-banner>
      </div>
    </div>
    <div class="row full-width q-mr-xl justify-center">
      <!-- Latest Transactions-->
      <div class=" col-11">
        <!-- Rename that component-->
        <x-transaction-list :show-type="true" :transactions="transactions"
          :details-link="getAllTransactionsPath(chainType)" @refresh="refreshTransactions"
          @row-clicked="openTransactionDetail">
        </x-transaction-list>
      </div>
    </div>
  </q-page>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import XTransactionList from 'src/components/XTransactionList.vue';
import SearchBanner from 'src/components/SearchBanner.vue';
import { Block } from 'src/types/block';
import { useRouter } from 'vue-router';
import { getBlockDetailsPath, getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { usePIndexStore } from 'src/stores/p-index-store'
import { XTransaction } from 'src/types/transaction';

export default defineComponent({
  name: 'PChainPage',
  components: { XTransactionList, SearchBanner },
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
      openBlockDetail(item: Block) {
        router.push(getBlockDetailsPath(chainType, item.hash))
      },
      openTransactionDetail(item: XTransaction) {
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
