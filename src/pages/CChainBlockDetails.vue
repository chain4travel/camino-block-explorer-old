<template>
  <!-- content -->
  <div class="row">
    <div class="col-12">
      <BlockDetailsView
        :type="type"
        :title="'C-Chain Block ' + blockId"
        :back-route="backroute"
        :content="loadedBlock"
      >
      </BlockDetailsView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BlockDetailsView from 'src/components/BlockDetailsView.vue';
import { useRoute } from 'vue-router';
import { getOverviewPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useCIndexStore } from 'src/stores/c-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';

export default defineComponent({
  name: 'CChainBlockdetails',
  components: { BlockDetailsView },
  async setup() {
    const route = useRoute();
    const cChain = useCIndexStore();
    const blockId = getStringOrFirstElement(route.params.blockId);
    return {
      blockId: route.params.blockId,
      backroute: route.query.back
        ? route.query.back
        : getOverviewPath(ChainType.C_CHAIN),
      loadedBlock: await cChain.loadByBlockId(blockId),
      type: ChainType.C_CHAIN,
    };
  },
});
</script>
