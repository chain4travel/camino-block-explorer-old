<template>
  <q-card>
    <q-card-section>
      <q-list bordered separator>
        <DetailField
          class="highlighted q-pt-md"
          icon="mdi-transfer"
          field="Transaction"
          :value="content.hash"
          type="hexdata"
          :allow-copy="true"
          :md-length="38"
          :sm-length="30"
          :xs-length="16"
        />
      </q-list>
    </q-card-section>
    <q-card-section class="container">
      <q-list bordered separator>
        <DetailField
          icon="mdi-help-circle-outline"
          field="Type"
          :value="content.type"
          type="ctxtype"
        />
        <DetailField
          icon="mdi-help-circle-outline"
          field="Block"
          :value="content.block"
          type="string"
          :details-link="getBlockDetailsPath(type, content.block)"
        />
        <DetailField
          icon="mdi-help-circle-outline"
          field="Date"
          :value="content.createdAt"
          type="timestamp"
        />
        <DetailField
          icon="mdi-help-circle-outline"
          field="From"
          :value="content.fromAddr"
          type="hexdata"
          :allow-copy="true"
          :md-length="38"
          :sm-length="30"
          :xs-length="16"
        />
        <DetailField
          icon="mdi-help-circle-outline"
          field="To"
          :value="content.toAddr"
          type="hexdata"
          :allow-copy="true"
          :md-length="38"
          :sm-length="30"
          :xs-length="16"
        />
      </q-list>
    </q-card-section>
    <q-card-section class="container">
      <q-list bordered separator>
        <DetailField
          v-if="content.gasPrice"
          icon="mdi-help-circle-outline"
          field="Gas Price"
          :value="content.gasPrice"
          type="wei"
        />
        <DetailField
          v-if="content.maxFeePerGas && content.maxPriorityFeePerGas"
          icon="mdi-help-circle-outline"
          field="Max fee per gas"
          :value="content.maxFeePerGas"
          type="wei"
        />
        <DetailField
          v-if="content.maxFeePerGas && content.maxPriorityFeePerGas"
          icon="mdi-help-circle-outline"
          field="Max Priority fee per gas"
          :value="content.maxPriorityFeePerGas"
          type="wei"
        />
        <DetailField
          icon="mdi-help-circle-outline"
          field="Gas Used"
          :value="content.gasUsed"
          type="number"
        />
        <DetailField
          v-if="content.contractAddress && parseInt(content.contractAddress)"
          icon="mdi-help-circle-outline"
          field="Contract Address"
          :value="content.contractAddress"
          type="hexdata"
          :allow-copy="true"
        ></DetailField>
        <DetailField
          icon="mdi-help-circle-outline"
          field="Effective Gas Price"
          :value="content.effectiveGasPrice"
          type="wei"
        />
        <DetailField
          icon="mdi-help-circle-outline"
          field="Transaction Cost"
          :value="content.transactionCost"
          type="wei"
        />
        <!-- <DetailField icon="mdi-help-circle-outline" field="Gas Limit" :value="content.gasLimit" type="number" /> -->
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn class="full-width" rounded outline color="primary" :to="backRoute"
        >Back</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { getBlockDetailsPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import DetailField from 'src/components/ui/DetailField.vue';
import { TranscationDetail } from 'src/types/transaction';
import { LocationQueryValue } from 'vue-router';

export default defineComponent({
  name: 'TransactionDetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: {
      type: String as PropType<string | LocationQueryValue[]>,
      required: false,
    },
    content: { type: Object as PropType<TranscationDetail>, required: true },
    magellan: { type: Boolean, default: false },
  },
  setup() {
    return {
      getBlockDetailsPath,
    };
  },
  components: { DetailField },
});
</script>
