<template>
  <div class="row justify-center">
    <ChainOverviewCards class="col-9" :price-in-wei="true" :store="cStore"/>
  </div>
  <div class="row">
    <div :class="$q.screen.lt.md ? 'col-12 q-pa-md' : 'col-md-6 q-pr-sm q-pl-md'">
      <div>
        <!-- Latest Blocks-->
        <BlockList :has-next-page="blockHasNextPage" :blocks="blocks" :show-all-link="getAllBlocksPath(ChainType.C_CHAIN)"
          @refresh="refreshBlocks" :detailsLinkFunction="getBlockDetailsLink">
        </BlockList>
      </div>
    </div>
    <!-- Latest Transactions-->
    <div :class="$q.screen.lt.md ? 'col-12 q-pa-md' : 'col-md-6 q-pl-sm q-pr-md'">
      <CTransactionList :transactions="transactions" :show-all-link="getAllTransactionsPath(ChainType.C_CHAIN)"
        @refresh="refreshTransactions" :detailsLinkFunction="getTransactionDetailsLink">
      </CTransactionList>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import BlockList from 'src/components/BlockList.vue';
import CTransactionList from 'src/components/CTransactionList.vue';
import { BlockTableData } from 'src/types/block';
import { CTransaction } from 'src/types/transaction';
import { getBlockDetailsPath, getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { computed } from '@vue/reactivity';
import { useCIndexStore } from 'src/stores/c-index-store';
import ChainOverviewCards from 'src/components/ChainOverviewCards.vue';

export default defineComponent({
  name: 'CChainPage',
  components: { BlockList, CTransactionList, ChainOverviewCards },
  emits: ['search', 'refresh-blocks', 'refresh-transactions'],
  props: {
    // type: { type: String as PropType<ChainType>, required: true },
    pageSize: { type: Number, default: 10 },
  },
  async setup(props, { emit }) {
    const cStore = useCIndexStore();
    const blocks: Ref<BlockTableData[]> = ref(await cStore.loadBlocks(0, props.pageSize))
    const transactions: Ref<CTransaction[]> = ref(await cStore.loadTransactions(0, props.pageSize))
    const blockPage = ref(1);
    const transactionsPage = ref(1);

    return {
      cStore,
      ChainType,
      blocks,
      transactions,
      blockPage,
      transactionsPage,
      blockHasNextPage: computed(() => !(blocks.value.some(item => item.number === 0))),
      search(value: string) {
        emit('search', value);
      },
      async refreshBlocks() {
        blocks.value = await cStore.loadBlocks((blockPage.value - 1) * props.pageSize, props.pageSize)
      },
      async refreshTransactions() {
        transactions.value = (await cStore.loadTransactions((transactionsPage.value - 1) * props.pageSize, props.pageSize))
      },
      getBlockDetailsLink(item: number) {
        return getBlockDetailsPath(ChainType.C_CHAIN, item);
      },
      getTransactionDetailsLink(item: string) {
        return getTransactionDetailsPath(ChainType.C_CHAIN, item);
      },
      async loadBlockPage(newPageNumber: number) {
        blocks.value = await cStore.loadBlocks((newPageNumber - 1) * props.pageSize, props.pageSize);
        blockPage.value = newPageNumber;
      },
      async loadTransactionPage(newPageNumber: number) {
        transactions.value = await (await cStore.loadTransactions((newPageNumber - 1) * props.pageSize, props.pageSize));
        transactionsPage.value = newPageNumber
      },
      getAllBlocksPath,
      getAllTransactionsPath
    }
  }
})
</script>
