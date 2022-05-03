<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="offset-2 col-8">
        <block-details-view :type="type" :title="'C-Chain Block '" :back-route="backroute" :content="loadedBlock">
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
import { useCIndexStore } from 'src/stores/c-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';

const useMagellan = false;

export default defineComponent({
  name: 'CChainBlockdetails',
  components: { BlockDetailsView },
  async setup() {
    const route = useRoute();
    const cChain = useCIndexStore();
    return {
      blockId: route.params.blockId,
      backroute: route.query.back ? route.query.back : getBasePath(ChainType.C_CHAIN),
      loadedBlock: useMagellan ? await cChain.loadMagellanBlockByNumber(parseInt(getStringOrFirstElement(route.params.blockId))) : await cChain.loadByBlockId(getStringOrFirstElement(route.params.blockId)),
      type: ChainType.C_CHAIN
    }
  }
})
</script>
