<template>
  <q-page>
    <chain-view @search="search" :blocks="blocks" :transactions="transactions"></chain-view>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { useCIndexStore } from 'src/stores/c-index-store'
import { Transaction } from 'src/types/transaction';
import ChainView from 'src/components/ChainView.vue';

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
  components: { ChainView },
  async setup() {
    return {
      blocks: await useCIndexStore().loadBlocks(),
      transactions: createMockTransactions(),
      getRelativeTime,
      search(value: string) {
        console.log('Searching for value', value);
      }
    };
  },

})
</script>
