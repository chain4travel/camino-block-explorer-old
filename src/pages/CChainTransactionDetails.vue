<template>
  <!-- content -->
  <div class="row">
    <div class="col-12">
      <q-card class="col">
        <q-card-section>
          <div class="row">
            <q-btn
              icon="mdi-chevron-left"
              class="col-auto"
              size="sm"
              rounded
              outline
              color="primary"
              :to="backroute"
            >
            </q-btn>
            <div class="text-h6 q-pl-md col-10">C-Chain Transaction</div>
          </div>
        </q-card-section>
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
              <q-separator />
            </div>
          </div>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="overview">
              <TransactionDetailsView
                :type="type"
                :back-route="backroute"
                :content="loadedTransaction"
              >
              </TransactionDetailsView>
            </q-tab-panel>
            <q-tab-panel name="logs">
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import TransactionDetailsView from 'src/components/TransactionDetailsView.vue';
import { useRoute } from 'vue-router';
import { getOverviewPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { useCIndexStore } from 'src/stores/c-index-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';

const tabs = [
  {
    key: 'overview',
    label: 'Overview',
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
      tab: ref('overview'),
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
