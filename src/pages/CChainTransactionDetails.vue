<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="offset-2 col-8">
        <transaction-details-view :type="type" :title="'C-Chain Transaction ' + transactionId" :back-route="backroute"
          :content="loadedTransaction">
        </transaction-details-view>
      </div>
    </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TransactionDetailsView from 'src/components/TransactionDetailsView.vue'
import { useRoute } from 'vue-router'
import { getBasePath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useCIndexStore } from 'src/stores/c-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';

const useMagellan = false;

export default defineComponent({
  name: 'CChainTransactionDetails',
  components: { TransactionDetailsView },
  async setup() {
    const route = useRoute();
    const cChain = useCIndexStore();
    return {
      transactionId: route.params.transactionId,
      backroute: route.query.back ? route.query.back :getBasePath(ChainType.C_CHAIN),
      loadedTransaction: useMagellan ? await cChain.loadMagellanTransactionbyHash(getStringOrFirstElement(route.params.transactionId)) : await cChain.loadTransactionById(getStringOrFirstElement(route.params.transactionId)),
      type: ChainType.C_CHAIN
    }
  }
})
</script>
