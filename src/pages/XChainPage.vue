<template>
  <div>
    <div class="col-12 text-right q-pb-sm">
      <q-btn
        outline
        rounded
        color="primary"
        icon="mdi-refresh"
        @click="refreshAll()"
      />
    </div>
    <div class="row justify-center">
      <ChainOverviewCards class="col-12" :store="xStore" />
    </div>
    <div class="row full-width justify-center">
      <!-- Latest Transactions-->
      <div class="col-12">
        <XPTransactionList
          :transactions="transactions"
          :type="chainType"
          :show-all-link="getAllTransactionsPath(chainType)"
          @refresh="refreshTransactions"
          :detailsLinkFunction="getTransactionDetailsLink"
        >
        </XPTransactionList>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import XPTransactionList from 'src/components/XPTransactionList.vue';
import {
  getTransactionDetailsPath,
  getAllTransactionsPath,
  getAllBlocksPath,
} from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useXIndexStore } from 'src/stores/x-index-store';
import ChainOverviewCards from 'src/components/ChainOverviewCards.vue';

export default defineComponent({
  name: 'XChainPage',
  components: { XPTransactionList, ChainOverviewCards },
  async setup(props, { emit }) {
    const pageSize = 10;
    const chainType = ChainType.X_CHAIN;
    const xStore = useXIndexStore();
    const transactions = ref(await xStore?.loadTransactions(0, pageSize));

    return {
      xStore,
      pageSize,
      chainType,
      transactions,
      async refreshAll() {
        xStore.refreshAll(xStore.store.selectedTime);
        transactions.value = await xStore?.loadTransactions(0, pageSize);
      },
      search(value: string) {
        emit('search', value);
      },
      async refreshTransactions() {
        transactions.value = await xStore?.loadTransactions(0, pageSize);
      },
      getTransactionDetailsLink(item: string) {
        return getTransactionDetailsPath(chainType, item);
      },
      getAllBlocksPath,
      getAllTransactionsPath,
    };
  },
});
</script>
