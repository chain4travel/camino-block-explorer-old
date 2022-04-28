<template>
  <q-page class="flex">
    <search-banner @search="search"></search-banner>
    <div class="row full-width q-mr-xl">

      <!-- Latest Transactions-->
      <div class="offset-1 col-10 q-ml-xl">
        <transaction-list :transactions="transactions" :details-link="getAllTransactionsPath(chainType)"
          @refresh="refreshTransactions" @row-clicked="openTransactionDetail">
        </transaction-list>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import BlockList from 'src/components/BlockList.vue';
import TransactionList from 'src/components/TransactionList.vue';
import SearchBanner from 'src/components/SearchBanner.vue';
import { ChainViewLoader } from 'src/types/chain-view-loader';
import { Block } from 'src/types/block';
import { Transaction } from 'src/types/transaction';
import { useRouter } from 'vue-router';
import { getBlockDetailsPath, getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { computed } from '@vue/reactivity';
import { useXIndexStore } from 'src/stores/x-index-store'

export default defineComponent({
  name: 'XChainPage',
  components: { TransactionList, SearchBanner },
  emits: ['search', 'refresh-blocks', 'refresh-transactions'],
  async setup(props, { emit }) {
    const router = useRouter();
    const pageSize = 10;
    const chainType = 'x-chain' as ChainType;
    const store = useXIndexStore();
    const transactions = ref(await store?.loadLatestTransactions(true, 0, pageSize))
    const blockPage = ref(1);
    const transactionsPage = ref(1);
    const blocks = ref(await store?.loadLatestBlocks(true, 0, pageSize))

    return {
      blocks,
      store,
      pageSize,
      chainType,
      transactions,
      blockPage,
      transactionsPage,
      blockHasNextPage: computed(() => !(blocks.value.some(item => item.height === 0))),
      search(value: string) {
        emit('search', value);
      },
      async refreshBlocks() {
        blocks.value = await store?.loadLatestBlocks(true, (blockPage.value - 1) * pageSize, pageSize)
      },
      async refreshTransactions() {
        transactions.value = await store?.loadLatestTransactions(true, (transactionsPage.value - 1) * pageSize, pageSize)
      },
      openBlockDetail(item: Block) {
        router.push(getBlockDetailsPath(chainType, item.hash))
      },
      openTransactionDetail(item: Transaction) {
        if (!item.hash) {
          return;
        }
        router.push(getTransactionDetailsPath(chainType, item.hash))
      },
      async loadBlockPage(newPageNumber: number) {
        blocks.value = await store.loadLatestBlocks(true, (newPageNumber - 1) * pageSize, pageSize);
        blockPage.value = newPageNumber;
      },
      async loadTransactionPage(newPageNumber: number) {
        transactions.value = await store.loadLatestTransactions(true, (newPageNumber - 1) * pageSize, pageSize);
        transactionsPage.value = newPageNumber
      },
      getAllBlocksPath,
      getAllTransactionsPath
    }
  }
})
</script>
