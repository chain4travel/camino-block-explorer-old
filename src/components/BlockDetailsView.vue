<template>
  <div>
    <q-card>
      <q-card-section v-if="title">
        <div class="row">
          <q-btn icon="mdi-chevron-left" class="col-auto" size="sm" rounded outline color="primary" :to="backRoute">
          </q-btn>
          <div class="text-h6 q-pl-md col-10">{{ title }}</div>
        </div>
      </q-card-section>
      <q-card-section v-if="title">
        <q-list bordered seperator>
          <DetailField class="highlighted q-pt-md" icon="mdi-cube-outline" field="Block" :value="content.hash"
            type="string" :allow-copy="true" />
        </q-list>
      </q-card-section>
      <q-card-section class="container">
        <q-list bordered separator>
          <DetailField icon="mdi-help-circle-outline" field="Number" :value="content.blockNumber" type="string" />
          <DetailField icon="mdi-help-circle-outline" field="Parent Hash" :value="content.parentHash" type="string"
            :details-link="content.parentBlockNumber ? getBlockDetailsPath(type, content.parentBlockNumber) : undefined"
            :allow-copy="true" />
          <DetailField icon="mdi-help-circle-outline" field="Base Gas Fee" :value="content.baseGaseFee" type="wei" />
          <DetailField icon="mdi-help-circle-outline" field="Fees" :value="content.fees" type="wei" />
          <!-- <DetailField icon="mdi-help-circle-outline" field="Gas Limit" :value="content.gasLimit" type="number" /> -->
          <DetailField icon="mdi-help-circle-outline" field="Gas Used" :value="content.gasUsed" type="number" />
          <DetailField icon="mdi-help-circle-outline" field="Timestamp" :value="content.timestamp" type="timestamp" />
          <DetailField icon="mdi-help-circle-outline" field="Transaction Count" :value="content.transactionCount"
            type="string" />
          <DetailField icon="mdi-help-circle-outline" field="Extra Data"
            :value="content.additionalInformation.extraData" type="hexdata" />
        </q-list>
      </q-card-section>
    </q-card>
    <CTransactionList title="Block Transactions" class="q-mt-md" v-if="content.transactions && content.transactions.length" :transactions="content.transactions"
      hide-refresh :detailsLinkFunction="getTransactionDetailsLink">
    </CTransactionList>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BlockDetails } from 'src/types/block'
import { getBlockDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type'
import DetailField from 'src/components/ui/DetailField.vue'
import CTransactionList from './CTransactionList.vue'
import { getTransactionDetailsPath } from 'src/utils/route-utils'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'BlockDetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<BlockDetails>, required: true },
  },
  setup() {
    const route = useRoute();
    return {
      getBlockDetailsPath,
      getTransactionDetailsLink: (hash: string): string => {
        return `${getTransactionDetailsPath(ChainType.C_CHAIN, hash)}?back=${route.fullPath}`;
      }
    };
  },
  components: { DetailField, CTransactionList }
})
</script>
