<template>
  <div>
    <div class="col-12 text-right q-pb-sm">
      <q-btn outline rounded color="primary" icon="mdi-refresh" @click="refreshAll()" />
    </div>
    <div class="row justify-center">
      <ChainOverviewCards class="col-12" :store="pStore" />
    </div>
    <div class="row full-width">
      <!-- Latest Transactions-->
      <div class="col-12">
        <!-- Rename that component-->
        <XPTransactionList :transactions="transactions"
          :show-all-link="getAllTransactionsPath(chainType)" @refresh="refreshTransactions" :type="chainType" :detailsLinkFunction="getTransactionDetailsLink" >
        </XPTransactionList>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import XPTransactionList from 'src/components/XPTransactionList.vue';
import { getTransactionDetailsPath, getAllTransactionsPath, getAllBlocksPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { usePIndexStore } from 'src/stores/p-index-store'
import ChainOverviewCards from 'src/components/ChainOverviewCards.vue';

export default defineComponent({
  name: 'PChainPage',
  components: { XPTransactionList, ChainOverviewCards },
  async setup() {
    const pageSize = 10;
    const chainType = ChainType.P_CHAIN;
    const pStore = usePIndexStore();
    const transactions = ref(await pStore?.loadTransactions(0, pageSize))

    return {
      pStore,
      pageSize,
      chainType,
      transactions,
      async refreshAll() {
        pStore.refreshAll(pStore.store.selectedTime);
        transactions.value = await pStore?.loadTransactions(0, pageSize)
      },
      async refreshTransactions() {
        transactions.value = await pStore?.loadTransactions(0, pageSize)
      },
      getTransactionDetailsLink(item: string) {
        return getTransactionDetailsPath(chainType, item);
      },
      getAllBlocksPath,
      getAllTransactionsPath
    }
  }
})
</script>
