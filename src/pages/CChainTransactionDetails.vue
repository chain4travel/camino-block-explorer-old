<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="offset-2 col-8">
        <details-view :type="type" :title="'C-Chain Transaction ' + transactionId" :back-route="backroute"
          :content="loadedTransaction">
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
  name: 'CChainTransactionDetails',
  components: { DetailsView },
  async setup() {
    const route = useRoute();
    const cChain = useCIndexStore();
    return {
      transactionId: route.params.transactionId,
      backroute: getBasePath(ChainType.C_CHAIN),
      loadedTransaction: await cChain.loadTransactionById(getStringOrFirstElement(route.params.transactionId)),
      type: ChainType.C_CHAIN
    }
  }
})
</script>
