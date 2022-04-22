<template>
  <q-page>
    <chain-view @search="search" :store="cStore" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { useCIndexStore } from 'src/stores/c-index-store'
import ChainView from 'src/components/ChainView.vue';

export default defineComponent({
  name: 'CChainPage',
  components: { ChainView },

  async setup() {
    const cStore = useCIndexStore();
    return {
      cStore,
      getRelativeTime,
      search(value: string) {
        console.log('Searching for value', value);
      },
    };
  },

})
</script>
