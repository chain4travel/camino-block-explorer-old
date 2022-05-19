<template>
  <div class=" text-center q-pa-xl">
    <div>
      <h2>
        404 Page Not Found
      </h2>
      <q-btn class="q-mt-xl" color="primary" :to="{ name: backrouteName }" label="Back to Home" no-caps />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getOverviewPathName } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';

export default defineComponent({
  name: 'ErrorNotFound',
  setup() {
    return {
      backrouteName: getOverviewPathName(ChainType.C_CHAIN)
    }
  }
})
</script>
