<template>
  <!-- content -->
  <div class="row">
    <div class="offset-md-2 col-md-8 col-12">
      <x-p-transaction-details-view title="P-Chain Transaction " :back-route="backroute" :content="loadedTransaction">
      </x-p-transaction-details-view>
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
import { usePIndexStore } from 'src/stores/p-index-store';


export default defineComponent({
  name: 'PChainTransactionDetails',
  components: { XPTransactionDetailsView },
  async setup() {
    const route = useRoute();
    const pChain = usePIndexStore();
    return {
      transactionId: route.params.transactionId,
      backroute: route.query.back || getOverviewPath(ChainType.P_CHAIN),
      loadedTransaction: await pChain.loadTransactionById(getStringOrFirstElement(route.params.transactionId))
    }
  }
})
</script>
