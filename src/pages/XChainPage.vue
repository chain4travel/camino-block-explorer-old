<template>
  <q-page>
    <chain-view @search="search" :store="xStore" :type="chainType" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChainView from 'src/components/ChainView.vue'
import { useXIndexStore } from 'src/stores/x-index-store';
import { ChainType } from 'src/types/chain-type';
export default defineComponent({
  name: 'XChainPage',
  components: { ChainView },
  async setup() {
    const xStore = useXIndexStore();
    return {
      xStore,
      chainType: ChainType.X_CHAIN,
      search(value: string) {
        console.log('Seaching for ', value)
      }
    }
  }
})
</script>
