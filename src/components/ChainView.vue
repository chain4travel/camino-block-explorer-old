<template>
  <q-page class="flex">
    <search-banner @search="search"></search-banner>
    <div class="row full-width q-mr-xl">
      <div class="offset-1 col-5">
        <!-- Latest Blocks-->
        <block-list :blocks="blocks"></block-list>
      </div>
      <!-- Latest Transactions-->
      <div class="col-5 q-ml-xl">
        <transaction-list :transactions="transactions"></transaction-list>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Block } from 'src/types/block'
import { Transaction } from 'src/types/transaction'
import { defineComponent, PropType } from 'vue'
import BlockList from 'src/components/BlockList.vue';
import TransactionList from 'src/components/TransactionList.vue';
import SearchBanner from 'src/components/SearchBanner.vue';

export default defineComponent({
  name: 'ListCard',
  components: { BlockList, TransactionList, SearchBanner },
  emits: ['search'],
  props: {
    blocks: { type: Array as PropType<Block[]>, required: true },
    transactions: { type: Array as PropType<Transaction[]>, required: true }
  },
  setup(props, { emit }) {
    return {
      search(value: string) {
        emit('search', value);
      }
    }
  }
})
</script>

<style>
</style>
