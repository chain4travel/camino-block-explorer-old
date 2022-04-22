loadLatestBlocks<template>
  <q-page>
    <chain-view @search="search" :blocks="blocks" :transactions="transactions"></chain-view>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { useCIndexStore } from 'src/stores/c-index-store'
import ChainView from 'src/components/ChainView.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { ChainView },
  async setup() {
    const cStore = useCIndexStore();
    return {
      blocks: await cStore.loadLatestBlocks(),
      transactions: await cStore.loadLatestTransactions(),
      getRelativeTime,
      search(value: string) {
        console.log('Searching for value', value);
      }
    };
  },

})
</script>
