<template>
  <q-page>
    <chain-view @search="search" :blocks="blocks" :transactions="transactions"></chain-view>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChainView from 'src/components/ChainView.vue'
export default defineComponent({
  name: 'PChainPage',
  components: { ChainView },
  setup() {
    return {
      blocks: [],
      transactions: [],
      search(value: string) {
        console.log('Seaching for ', value)
      }
    }
  }
})
</script>
