<template>
  <q-page class="flex">
    <search-banner @search="search"></search-banner>
    <div class="row full-width q-mr-xl">
      <div class="offset-1 col-5">
        <!-- Latest Blocks-->
        <block-list :blocks="blocks" @refresh="refreshBlocks" @row-clicked="openBlockDetail"></block-list>
      </div>
      <!-- Latest Transactions-->
      <div class="col-5 q-ml-xl">
        <transaction-list :transactions="transactions" @refresh="refreshTransactions"
          @row-clicked="openTransactionDetail">
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
import { getTransactionDetailsPath, getTransactionsPathName } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';

export default defineComponent({
  name: 'ListCard',
  components: { BlockList, TransactionList, SearchBanner },
  emits: ['search', 'refresh-blocks', 'refresh-transactions'],
  props: {
    type: { type: String as PropType<ChainType>, required: true },
    store: { type: Object as PropType<ChainViewLoader> | undefined, required: true }
  },
  async setup(props, { emit }) {
    const router = useRouter();
    const blocks = ref(await props.store?.loadLatestBlocks())
    const transactions = ref(await props.store?.loadLatestTransactions())

    return {
      blocks,
      transactions,
      search(value: string) {
        emit('search', value);
      },
      async refreshBlocks() {
        blocks.value = await props.store?.loadLatestBlocks()
      },
      async refreshTransactions() {
        transactions.value = await props.store?.loadLatestTransactions()
      },
      openBlockDetail(item: Block) {
        console.log('Opening block detail', item)
        router.push(getBlockDetailsPath(props.type, item.hash))
      },
      openTransactionDetail(item: Transaction) {
        console.log('Opening transaction detail', item)
        router.push(getTransactionDetailsPath(props.type, item.hash))
      }
    }
  }
})
</script>

<style>
</style>
