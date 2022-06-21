<template>
  <div class="row">
    <div class="col-12">
      <XPTransactionDetailsView title="X-Chain Transaction " :back-route="backroute" :content="loadedTransaction">
      </XPTransactionDetailsView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import XPTransactionDetailsView from 'src/components/XPTransactionDetailsView.vue'
import { useRoute } from 'vue-router'
import { getOverviewPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { getStringOrFirstElement } from 'src/utils/display-utils';
import { useXIndexStore } from 'src/stores/x-index-store';


export default defineComponent({
  name: 'XChainTransactionDetails',
  components: { XPTransactionDetailsView },
  async setup() {
    const route = useRoute();
    const xChain = useXIndexStore();
    return {
      transactionId: route.params.transactionId,
      backroute: route.query.back || getOverviewPath(ChainType.X_CHAIN),
      loadedTransaction: await xChain.loadTransactionById(getStringOrFirstElement(route.params.transactionId))
    }
  }
})
</script>
