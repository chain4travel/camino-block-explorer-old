<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col">
        <search-banner @search="search"></search-banner>
      </div>
    </div>
    <div class="row ">
      <div class="col-xs-12 col-md-6 q-pr-s q-pl-md">
        <!-- Latest Blocks-->
        <block-list :has-next-page="blockHasNextPage" :blocks="blocks" :show-all-link="getAllBlocksPath(type)"
          @refresh="refreshBlocks" @row-clicked="openBlockDetail">
        </block-list>
      </div>
      <!-- Latest Transactions-->
      <div class="col-xs-12 col-md-6 col-6 q-pl-md q-pr-md">
        <transaction-list :transactions="transactions" :show-all-link="getAllTransactionsPath(type)"
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
  name: 'ChainView',
  components: { BlockList, TransactionList, SearchBanner },
  emits: ['search', 'refresh-blocks', 'refresh-transactions'],
  props: {
    type: { type: String as PropType<ChainType>, required: true },
    store: { type: Object as PropType<ChainViewLoader> | undefined, required: true },
    pageSize: { type: Number, default: 10 },
  },
  async setup(props, { emit }) {
    const router = useRouter();
    const blocks = ref(await props.store?.loadLatestBlocks(0, props.pageSize))
    const transactions = ref(await props.store?.loadLatestTransactions(0, props.pageSize))
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
        blocks.value = await props.store?.loadLatestBlocks((blockPage.value - 1) * props.pageSize, props.pageSize)
      },
      async refreshTransactions() {
        transactions.value = (await props.store?.loadLatestTransactions((transactionsPage.value - 1) * props.pageSize, props.pageSize))
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
        blocks.value = await props.store.loadLatestBlocks((newPageNumber - 1) * props.pageSize, props.pageSize);
        blockPage.value = newPageNumber;
      },
      async loadTransactionPage(newPageNumber: number) {
        transactions.value = await (await props.store.loadLatestTransactions((newPageNumber - 1) * props.pageSize, props.pageSize));
        transactionsPage.value = newPageNumber
      },
      getAllBlocksPath,
      getAllTransactionsPath
    }
  }
})
</script>

<style scoped lang="sass">
*
  background: #1A1B1E
</style>
