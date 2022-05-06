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
        <DetailField d class="highlighted q-pt-md" icon="mdi-transfer" field="Id" :value="content.id" type="string" />
      </q-list>
    </q-card-section>
    <q-card-section>
      <q-list class="mobile-width">

        <DetailField icon="mdi-help-circle-outline" field="Status" :value="content.status" type="txstatus" />
        <DetailField icon="mdi-help-circle-outline" field="Type" :value="content.type" type="txtype" />
        <DetailField icon="mdi-help-circle-outline" field="Timestamp" :value="content.timestamp" type="timestamp" />
        <DetailField icon="mdi-help-circle-outline" field="Fee" :value="content.fee" type="gwei" />
        <DetailField icon="mdi-help-circle-outline" field="Memo" :value="content.memo" type="string" />
        <div class="row">
          <div class="col-md-6 col-12 q-pa-sm">
            <q-card class="q-ma-sm light-card" :key="fund.address" v-for="fund in content.from">
              <q-card-section>
                <div class="row">
                  <div class="text-subtitle1 col-12">Input</div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-list dense>
                  <DetailField icon="mdi-help-circle-outline" field="From" :value="fund.address" type="string" />
                  <DetailField icon="mdi-help-circle-outline" field="Signature" :value="fund.signature" type="string" />
                  <DetailField icon="mdi-help-circle-outline" field="Value" :value="fund.value" type="gwei" />
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-6 col-12 q-pa-sm">
            <q-card class="q-ma-sm light-card" :key="fund.address" v-for="fund in content.to">
              <q-card-section>
                <div class="row">
                  <div class="text-subtitle1 col-12">Output</div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-list dense>
                  <DetailField field="To" :value="fund.address" type="string" />
                  <DetailField field="Value" :value="fund.value" type="gwei" />
                </q-list>
              </q-card-section>
            </q-card>
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

export default defineComponent({
  name: 'XPTransactionDetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<XPTransaction>, required: true }
  },
  components: { DetailField }
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
