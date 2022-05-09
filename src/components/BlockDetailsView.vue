<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <q-btn icon="mdi-chevron-left" class="col-auto" size="sm" rounded outline color="primary" :to="backRoute">
        </q-btn>
        <div class="text-subtitle1 q-pl-md col-10">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section v-if="title">
      <q-list bordered seperator>
        <detail-field class="highlighted q-pt-md" icon="mdi-cube-outline" field="Block" :value="content.hash"
          type="string" :allow-copy="true" />
      </q-list>
    </q-card-section>
    <q-card-section class="container">
      <q-list bordered separator>
        <detail-field icon="mdi-help-circle-outline" field="Number" :value="content.blockNumber" type="string" />
         <detail-field icon="mdi-help-circle-outline" field="Parent Hash" :value="content.parentHash" type="string"
          :details-link="content.parentBlockNumber ? getBlockDetailsPath(type, content.parentBlockNumber) : undefined" :allow-copy="true" />
                  <detail-field icon="mdi-help-circle-outline" field="Child hash" :value="content.childHash" type="string"
          :details-link="content.childBlockNumber ? getBlockDetailsPath(type, content.childBlockNumber) : undefined" />
        <detail-field icon="mdi-help-circle-outline" field="Base Gas Fee" :value="content.baseGaseFee" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Fees" :value="content.fees" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Gas Limit" :value="content.gasLimit" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Gas Used" :value="content.gasUsed" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Timestamp" :value="content.timestamp" type="timestamp" />
        <detail-field icon="mdi-help-circle-outline" field="Transaction Count" :value="content.transactionCount"
          type="string" />
        <detail-field icon="mdi-help-circle-outline" field="Difficulty"
          :value="content.additionalInformation.difficulty" type="string" />
        <detail-field icon="mdi-help-circle-outline" field="Extra Data" :value="content.additionalInformation.extraData"
          type="hexdata" />
        <detail-field icon="mdi-help-circle-outline" field="Logs Bloom" :value="content.additionalInformation.logsBloom"
          type="hexdata" />
        <detail-field icon="mdi-help-circle-outline" field="Uncles" :value="content.additionalInformation.uncles"
          type="string" />
        <detail-field icon="mdi-help-circle-outline" field="Nonce" :value="content.additionalInformation.nonce"
          type="string" />
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn class="full-width" rounded outline color="primary" :to="backRoute">Back</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { BlockDetails } from 'src/types/block-detail'
import { getBlockDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type'
import DetailField from 'src/components/ui/DetailField.vue'

export default defineComponent({
  name: 'DetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<BlockDetails>, required: true }
  },
  setup(props) {
    return {
      getBlockDetailsPath
    };
  },
  components: { DetailField }
})
</script>
