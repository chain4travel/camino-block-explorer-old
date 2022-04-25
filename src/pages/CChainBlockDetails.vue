<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="offset-2 col-8">
        <details-view :title="'C-Chain Bock ' + blockId" :back-route="backroute" :content="loadedBlock">
        </details-view>
      </div>
    </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DetailsView from 'src/components/DetailsView.vue'
import { useRoute } from 'vue-router'
import { getBasePath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useCIndexStore } from 'src/stores/c-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';

export default defineComponent({
  name: 'CChainBlockdetails',
  components: { DetailsView },
  async setup() {
    const route = useRoute();
    const cChain = useCIndexStore();
    return {
      blockId: route.params.blockId,
      backroute: getBasePath(ChainType.C_CHAIN),
      loadedBlock: await cChain.loadByBlockId(getStringOrFirstElement(route.params.blockId))
    }
  }
})
</script>
