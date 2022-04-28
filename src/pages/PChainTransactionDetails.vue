<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div class="offset-2 col-8">
        <transaction-details-view :title="'P-Chain Transaction ' + transactionId" :back-route="backroute"
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
import { getStringOrFirstElement } from 'src/utils/display-utils';
import { usePIndexStore } from 'src/stores/p-index-store';


export default defineComponent({
  name: 'PChainTransactionDetails',
  components: { TransactionDetailsView },
  async setup() {
    const route = useRoute();
    const pChain = usePIndexStore();
    return {
      transactionId: route.params.transactionId,
      backroute: getBasePath(ChainType.P_CHAIN),
      loadedTransaction: await pChain.loadTransactionById(getStringOrFirstElement(route.params.transactionId))
    }
  }
})
</script>
