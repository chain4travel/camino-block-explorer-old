<template>
  <q-page class="flex">
    <search-banner @search="search"></search-banner>
    <div class="row full-width q-mr-xl">
      <div class="offset-1 col-5">
        <!-- Latest Blocks-->
        <block-list :has-next-page="blockHasNextPage" :blocks="blocks" :details-link="getAllBlocksPath(type)"
          @refresh="refreshBlocks" @row-clicked="openBlockDetail">
        </block-list>
      </div>
      <!-- Latest Transactions-->
      <div class="col-5 q-ml-xl">
        <transaction-list :transactions="transactions" :details-link="getAllTransactionsPath(type)"
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
import { CTransaction } from 'src/types/transaction';
import { useRouter } from 'vue-router';
import { getBlockDetailsPath, getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { computed } from '@vue/reactivity';

export default defineComponent({
  name: 'ListCard',
  components: { BlockList, TransactionList, SearchBanner },
  emits: ['search', 'refresh-blocks', 'refresh-transactions'],
  props: {
    type: { type: String as PropType<ChainType>, required: true },
    store: { type: Object as PropType<ChainViewLoader> | undefined, required: true },
    pageSize: { type: Number, default: 10 },
  },
  async setup(props, { emit }) {
    const router = useRouter();
    const blocks = ref(await props.store?.loadLatestBlocks(true, 0, props.pageSize))
    const transactions = ref(await (await props.store?.loadLatestTransactions(true, 0, props.pageSize)).transactions)
    const blockPage = ref(1);
    const transactionsPage = ref(1);

    return {
      blocks,
      transactions,
      blockPage,
      transactionsPage,
      blockHasNextPage: computed(() => !(blocks.value.some(item => item.height === 0))),
      search(value: string) {
        emit('search', value);
      },
      async refreshBlocks() {
        blocks.value = await props.store?.loadLatestBlocks(true, (blockPage.value - 1) * props.pageSize, props.pageSize)
      },
      async refreshTransactions() {
        transactions.value = (await props.store?.loadLatestTransactions(true, (transactionsPage.value - 1) * props.pageSize, props.pageSize)).transactions
      },
      openBlockDetail(item: Block) {
        router.push(getBlockDetailsPath(props.type, item.hash))
      },
      openTransactionDetail(item: CTransaction) {
        if (!item.hash) {
          return;
        }
        router.push(getTransactionDetailsPath(props.type, item.hash))
      },
      async loadBlockPage(newPageNumber: number) {
        blocks.value = await props.store.loadLatestBlocks(true, (newPageNumber - 1) * props.pageSize, props.pageSize);
        blockPage.value = newPageNumber;
      },
      async loadTransactionPage(newPageNumber: number) {
        transactions.value = await (await props.store.loadLatestTransactions(true, (newPageNumber - 1) * props.pageSize, props.pageSize)).transactions;
        transactionsPage.value = newPageNumber
      },
      getAllBlocksPath,
      getAllTransactionsPath
    }
  }
})
</script>

<style>
</style>
