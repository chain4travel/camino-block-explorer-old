<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="offset-2 col-8">
        <block-details-view :title="'X-Chain Block ' + blockId" :back-route="backroute" :content="loadedBlock">
        </block-details-view>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BlockDetailsView from 'src/components/BlockDetailsView.vue'
import { useRoute } from 'vue-router'
import { getBasePath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useXIndexStore } from 'src/stores/x-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';

export default defineComponent({
  name: 'XChainBlockdetails',
  components: { BlockDetailsView },
  async setup() {
    const route = useRoute();
    const xChain = useXIndexStore();
    return {
      blockId: route.params.blockId,
      backroute: getBasePath(ChainType.X_CHAIN),
      loadedBlock: await xChain.loadByBlockId(getStringOrFirstElement(route.params.blockId))
    }
  }
})
</script>
