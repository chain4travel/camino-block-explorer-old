<template>
  <div class="row justify-center">
    <!-- This would be cool, but currently no easy way to get transaction count/gasfees -->
    <ChainOverviewCards class="col-9" :price-in-wei="true" :store="cStore"/>
  </div>
  <div>
    <ChainView @search="search" :store="cStore" :type="chainType" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { useCIndexStore } from 'src/stores/c-index-store'
import ChainView from 'src/components/ChainView.vue';
import { ChainType } from 'src/types/chain-type';
import ChainOverviewCards from 'src/components/ChainOverviewCards.vue';

export default defineComponent({
  name: 'CChainPage',
  components: { ChainView, ChainOverviewCards },

  async setup() {
    const cStore = useCIndexStore();
    return {
      cStore,
      chainType: ChainType.C_CHAIN,
      getRelativeTime,
    };
  },

})
</script>
