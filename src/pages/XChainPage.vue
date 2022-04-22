<template>
  <q-page>
    <chain-view @search="search" :store="xStore" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChainView from 'src/components/ChainView.vue'
import { useXIndexStore } from 'src/stores/x-index-store';
export default defineComponent({
  name: 'XChainPage',
  components: { ChainView },
  async setup() {
    const xStore = useXIndexStore();
    return {
      xStore,
      search(value: string) {
        console.log('Seaching for ', value)
      }
    }
  }
})
</script>
