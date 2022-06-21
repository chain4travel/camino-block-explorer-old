<template>
  <div class="col-12 text-right q-pb-sm">
    <q-btn outline rounded color="primary" icon="mdi-refresh" @click="refreshAll()" />
  </div>
  <div class="row justify-center">
    <ChainOverviewCards class="col-12" :store="cStore"/>
  </div>
  <div class="row">
    <div :class="$q.screen.lt.md ? 'col-12 q-py-md' : 'col-md-6 q-pr-sm'">
      <div>
        <!-- Latest Blocks-->
        <BlockList :has-next-page="blockHasNextPage" :blocks="blocks" :show-all-link="getAllBlocksPath(ChainType.C_CHAIN)"
          @refresh="refreshBlocks" :detailsLinkFunction="getBlockDetailsLink">
        </BlockList>
      </div>
    </div>
    <!-- Latest Transactions-->
    <div :class="$q.screen.lt.md ? 'col-12 q-py-md' : 'col-md-6 q-pl-sm'">
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
    const blocks: Ref<BlockTableData[]> = ref(await cStore.loadBlocks(NaN, props.pageSize))
    const transactions: Ref<CTransaction[]> = ref(await cStore.loadTransactions(NaN, props.pageSize))
    const blockPage = ref(1);
    const transactionsPage = ref(1);
    cStore.firstBlockNumber = await cStore.loadFirstBlockNumber(blocks.value[0]);

    return {
      cStore,
      ChainType,
      blocks,
      transactions,
      blockPage,
      transactionsPage,
      blockHasNextPage: computed(() => !(blocks.value.some(item => item.number === 0))),
      async refreshAll() {
        cStore.refreshAll(cStore.store.selectedTime);
        blocks.value = await cStore.loadBlocks(NaN, props.pageSize);
        transactions.value = await cStore.loadTransactions(NaN, props.pageSize);
      },
      search(value: string) {
        emit('search', value);
      },
      async refreshBlocks() {
        blocks.value = await cStore.loadBlocks(NaN, props.pageSize)
        cStore.firstBlockNumber = await cStore.loadFirstBlockNumber(blocks.value[0]);
      },
      async refreshTransactions() {
        transactions.value = await cStore.loadTransactions(NaN, props.pageSize);
        cStore.firstBlockNumber = await cStore.loadFirstBlockNumber(blocks.value[0]);
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
