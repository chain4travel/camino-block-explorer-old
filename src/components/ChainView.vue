<template>
  <div class="row ">
    <div :class="$q.screen.lt.md ? 'col-12 q-pa-md' : 'col-md-6 q-pr-sm q-pl-md'">
      <div>
        <!-- Latest Blocks-->
        <BlockList :has-next-page="blockHasNextPage" :blocks="blocks" :show-all-link="getAllBlocksPath(type)"
          @refresh="refreshBlocks" :detailsLinkFunction="getBlockDetailsLink">
        </BlockList>
      </div>
    </div>
    <!-- Latest Transactions-->
    <div :class="$q.screen.lt.md ? 'col-12 q-pa-md' : 'col-md-6 q-pl-sm q-pr-md'">
      <TransactionList :transactions="transactions" :show-all-link="getAllTransactionsPath(type)"
        @refresh="refreshTransactions" :detailsLinkFunction="getTransactionDetailsLink">
      </TransactionList>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref } from 'vue'
import BlockList from 'src/components/BlockList.vue';
import TransactionList from 'src/components/TransactionList.vue';
import { ChainViewLoader } from 'src/types/chain-view-loader';
import { BlockTableData } from 'src/types/block';
import { CTransaction } from 'src/types/transaction';
import { getBlockDetailsPath, getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { computed } from '@vue/reactivity';

export default defineComponent({
  name: 'ChainView',
  components: { BlockList, TransactionList },
  emits: ['search', 'refresh-blocks', 'refresh-transactions'],
  props: {
    type: { type: String as PropType<ChainType>, required: true },
    store: { type: Object as PropType<ChainViewLoader> | undefined, required: true },
    pageSize: { type: Number, default: 10 },
  },
  async setup(props, { emit }) {
    const blocks: Ref<BlockTableData[]> = ref(await props.store?.loadLatestBlocks(0, props.pageSize))
    const transactions: Ref<CTransaction[]> = ref(await props.store?.loadLatestTransactions(0, props.pageSize))
    const blockPage = ref(1);
    const transactionsPage = ref(1);

    return {
      blocks,
      transactions,
      blockPage,
      transactionsPage,
      blockHasNextPage: computed(() => !(blocks.value.some(item => item.number === 0))),
      search(value: string) {
        emit('search', value);
      },
      async refreshBlocks() {
        blocks.value = await props.store?.loadLatestBlocks((blockPage.value - 1) * props.pageSize, props.pageSize)
      },
      async refreshTransactions() {
        transactions.value = (await props.store?.loadLatestTransactions((transactionsPage.value - 1) * props.pageSize, props.pageSize))
      },
      getBlockDetailsLink(item: number) {
        return getBlockDetailsPath(props.type, item);
      },
      getTransactionDetailsLink(item: string) {
        return getTransactionDetailsPath(props.type, item);;
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

