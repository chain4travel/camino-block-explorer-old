<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="offset-2 col-8">
        <x-p-transaction-details-view title="X-Chain Transaction " :back-route="backroute"
          :content="loadedTransaction">
        </x-p-transaction-details-view>
      </div>
    </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import XPTransactionDetailsView from 'src/components/XPTransactionDetailsView.vue'
import { useRoute } from 'vue-router'
import { getBasePath } from 'src/utils/route-utils';
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
      backroute: getBasePath(ChainType.X_CHAIN),
      loadedTransaction: await xChain.loadTransactionById(getStringOrFirstElement(route.params.transactionId))
    }
  }
})
</script>
