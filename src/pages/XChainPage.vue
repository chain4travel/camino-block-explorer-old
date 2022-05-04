<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col">
        <search-banner @search="search"></search-banner>
      </div>
    </div>
    <div class="row full-width justify-center">
      <!-- Latest Transactions-->
      <div class="col-12 q-pr-md q-pl-md">
        <x-transaction-list :transactions="transactions" :show-all-link="getAllTransactionsPath(chainType)"
          @refresh="refreshTransactions" @row-clicked="openTransactionDetail">
        </x-transaction-list>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import XTransactionList from 'src/components/XTransactionList.vue';
import SearchBanner from 'src/components/SearchBanner.vue';
import { useRouter } from 'vue-router';
import { getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useXIndexStore } from 'src/stores/x-index-store'
import { XTransaction } from 'src/types/transaction';

export default defineComponent({
  name: 'XChainPage',
  components: { XTransactionList, SearchBanner },
  async setup(props, { emit }) {
    const router = useRouter();
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
