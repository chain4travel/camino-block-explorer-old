<template>
  <q-page>
    <chain-view @search="search" :store="pStore" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChainView from 'src/components/ChainView.vue'
import { usePIndexStore } from 'src/stores/p-index-store'
export default defineComponent({
  name: 'PChainPage',
  components: { ChainView },
  async setup() {
    const pStore = usePIndexStore();
    return {
      pStore,
      search(value: string) {
        console.log('Seaching for ', value)
      }
    }
  }
})
</script>
