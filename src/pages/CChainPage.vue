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
import { defineComponent, ref, Ref } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { useCIndexStore } from 'src/stores/c-index-store'
import BlockList from 'src/components/BlockList.vue';
import TransactionList from 'src/components/TransactionList.vue';
import { Transaction } from 'src/types/transaction';
import SearchBanner from 'src/components/SearchBanner.vue';


function createMockTransactions(): Transaction[] {
  const olderTimstamp = new Date();
  olderTimstamp.setMinutes(olderTimstamp.getMinutes() - 1);
  return [{
    originAdress: '0x279f8940ca2a44c35ca3edf7d28945254d0f0ae6',
    destinationAdress: '0xbbc0c798be9c5c857f0d6c51aa4a4ab2f5a197aa',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    fee: 11234556,
    timestamp: new Date().getTime(),
    status: 'success',
    block: 1,
    value: 233
  },
  {
    originAdress: '0x279f8940ca2a44c35ca3edf7d28945254d0f0ae6',
    destinationAdress: '0xbbc0c798be9c5c857f0d6c51aa4a4ab2f5a197aa',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    fee: 11234556,
    timestamp: olderTimstamp.getTime(),
    status: 'success',
    block: 1,
    value: 233
  }, {
    originAdress: '0x279f8940ca2a44c35ca3edf7d28945254d0f0ae6',
    destinationAdress: '0xbbc0c798be9c5c857f0d6c51aa4a4ab2f5a197aa',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    fee: 11234556,
    timestamp: olderTimstamp.getTime(),
    status: 'success',
    block: 1,
    value: 233
  }, {
    originAdress: '0x279f8940ca2a44c35ca3edf7d28945254d0f0ae6',
    destinationAdress: '0xbbc0c798be9c5c857f0d6c51aa4a4ab2f5a197aa',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    fee: 11234556,
    timestamp: olderTimstamp.getTime(),
    status: 'success',
    block: 1,
    value: 233
  }, {
    originAdress: '0x279f8940ca2a44c35ca3edf7d28945254d0f0ae6',
    destinationAdress: '0xbbc0c798be9c5c857f0d6c51aa4a4ab2f5a197aa',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    fee: 11234556,
    timestamp: olderTimstamp.getTime(),
    status: 'success',
    block: 1,
    value: 233
  },]
}

export default defineComponent({
  name: 'IndexPage',


  async setup() {
    return {
      blocks: await useCIndexStore().loadBlocks(),
      transactions: createMockTransactions(),
      getRelativeTime,
      search(value) {
        console.log('Searching for value', value)
      }
    };
  },
  components: { BlockList, TransactionList, SearchBanner }
})
</script>

<style lang="sass" scoped>

.burn-icon
  background-color:  rgba(255, 53, 53, 0.15)
  border-radius: 30px
  display: flex
  align-items: center
  align-content: flex-start
  justify-content: center
  justify-items: center
.icon-background
  background-color: #455374
  padding: 12px
  color: white
.gas-used
  background-color:  rgba(255, 255, 255, 0.15)
  border-radius: 30px
  display: flex
  align-items: center
  align-content: flex-start
  justify-content: center
  justify-items: center
</style>
