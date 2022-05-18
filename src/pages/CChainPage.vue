<template>
  <div>
    <!-- This would be cool, but currently no easy way to get transaction count/gasfees -->
    <!-- <ChainOverviewCards :store="cStore"></ChainOverviewCards> -->
    <chain-view @search="search" :store="cStore" :type="chainType" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { useCIndexStore } from 'src/stores/c-index-store'
import ChainView from 'src/components/ChainView.vue';
import { ChainType } from 'src/types/chain-type';

export default defineComponent({
  name: 'CChainPage',
  components: { ChainView },

  async setup() {
    const cStore = useCIndexStore();
    return {
      cStore,
      chainType: ChainType.C_CHAIN,
      getRelativeTime,
      search(value: string) {
        console.log('Searching for value', value);
      },
    };
  },

})
</script>
