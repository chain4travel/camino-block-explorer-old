<template>
  <!-- content -->
  <div class="row">
    Loading...
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useXIndexStore, MagellanTransaction } from 'src/stores/x-index-store'
import { getMagellanBaseUrl } from 'src/utils/client-utils'
import { transactionApi } from 'src/utils/magellan-api-utils'
import { getTransactionDetailsPath } from 'src/utils/route-utils'
import { getStringOrFirstElement } from 'src/utils/display-utils'
import { ChainType } from 'src/types/chain-type'
import axios from 'axios';

export default defineComponent({
  name: 'TxRedirectPage',
  async setup() {
    const router = useRouter();
    const route = useRoute();
    const xStore = useXIndexStore();
    const transactionId = getStringOrFirstElement(route.params.txId);
    const transaction: MagellanTransaction = await (await axios.get(getMagellanBaseUrl() + transactionApi + '/' + transactionId)).data;
    const xChain = await xStore.getChainId()
    if (transaction.chainID === xChain) {
      router.push(getTransactionDetailsPath(ChainType.X_CHAIN, transactionId))
    } else {
      router.push(getTransactionDetailsPath(ChainType.P_CHAIN, transactionId))
    }
    return {
    }
  }
})
</script>
