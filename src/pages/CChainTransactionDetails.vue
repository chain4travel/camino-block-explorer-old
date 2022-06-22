<template>
  <!-- content -->
  <div class="row">
    <div class="col-12">
      <q-card class="col">
        <q-card-section>
          <div class="row">
            <div class="col-auto">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab
                  v-for="tab of tabs"
                  :key="tab.key"
                  :name="tab.key"
                  :label="tab.label"
                />
              </q-tabs>
            </div>
          </div>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="transactions">
              <TransactionDetailsView
                :type="type"
                title="C-Chain Transaction"
                :back-route="backroute"
                :content="loadedTransaction"
              >
              </TransactionDetailsView>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TransactionDetailsView from 'src/components/TransactionDetailsView.vue';
import { useRoute } from 'vue-router';
import { getOverviewPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useCIndexStore } from 'src/stores/c-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';

const tabs = [
  {
    key: 'transactions',
    label: 'Transactions',
  },
  {
    key: 'logs',
    label: 'Logs',
  },
];

export default defineComponent({
  name: 'CChainTransactionDetails',
  components: { TransactionDetailsView },
  async setup() {
    const route = useRoute();
    const cChain = useCIndexStore();
    return {
      tab: ref('transactions'),
      tabs,
      transactionId: route.params.transactionId,
      backroute: route.query.back
        ? route.query.back
        : getOverviewPath(ChainType.C_CHAIN),
      loadedTransaction: await cChain.loadTransactionById(
        getStringOrFirstElement(route.params.transactionId)
      ),
      type: ChainType.C_CHAIN,
    };
  },
});
</script>
