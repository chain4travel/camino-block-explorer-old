<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <q-btn icon="mdi-chevron-left" class="col-auto" size="sm" rounded outline color="primary" :to="backRoute">
        </q-btn>
        <div class="text-subtitle1 q-pl-md  col-10">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-list bordered seperator>
        <DetailField d class="highlighted q-pt-md" icon="mdi-transfer" field="Id" :value="content.id" type="string"
          :allow-copy="true" />
      </q-list>
    </q-card-section>
    <q-card-section>
      <q-list bordered separator class="mobile-width">
        <DetailField icon="mdi-help-circle-outline" field="Status" :value="content.status" type="txstatus" />
        <DetailField icon="mdi-help-circle-outline" field="Type" :value="content.type" type="txtype" />
        <DetailField icon="mdi-help-circle-outline" field="Timestamp" :value="content.timestamp" type="timestamp" />
        <DetailField icon="mdi-help-circle-outline" field="Fee" :value="content.fee" type="gwei" />
        <DetailField icon="mdi-help-circle-outline" field="Memo" :value="content.memo" type="string" />
        <div class="row">
          <div class="col-md-6 col-12 q-pa-sm">
            <FundCard  type="From" title="Input" :funds="content.from"></FundCard>
          </div>
          <div class="col-md-6 col-12 q-pa-sm">
            <FundCard  type="To" title="Output" :funds="content.to"></FundCard>
          </div>
        </div>
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn class="full-width" rounded outline color="primary" :to="backRoute">Back</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ChainType } from 'src/types/chain-type'
import { XPTransaction } from 'src/types/transaction'
import DetailField from 'src/components/ui/DetailField.vue'
import FundCard from './ui/FundCard.vue'

export default defineComponent({
  name: 'XPTransactionDetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<XPTransaction>, required: true }
  },
  components: { DetailField, FundCard }
})
</script>
<style lang="sass" scoped>
.row
  @media (max-width: $breakpoint-sm-max)
    width: 100%
.mobile-width
  @media (max-width: $breakpoint-sm-max)
    width: 100%
</style>
