<template>
  <!-- content -->
  <div class="row">
    <div class="col-12">
      <TransactionDetailsView :type="type" title="C-Chain Transaction" :back-route="backroute"
        :content="loadedTransaction">
      </TransactionDetailsView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TransactionDetailsView from 'src/components/TransactionDetailsView.vue'
import { useRoute } from 'vue-router'
import { getOverviewPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useCIndexStore } from 'src/stores/c-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';


export default defineComponent({
  name: 'CChainTransactionDetails',
  components: { TransactionDetailsView },
  async setup() {
    const route = useRoute();
    const cChain = useCIndexStore();
    return {
      transactionId: route.params.transactionId,
      backroute: route.query.back ? route.query.back : getOverviewPath(ChainType.C_CHAIN),
      loadedTransaction: await cChain.loadTransactionById(getStringOrFirstElement(route.params.transactionId)),
      type: ChainType.C_CHAIN
    }
  }
})
</script>
