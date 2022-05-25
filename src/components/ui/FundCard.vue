<template>
  <q-card class="q-ma-sm light-card" :key="fund.address" v-for="fund in funds">
    <q-card-section>
      <div class="row">
        <div class="text-subtitle1 col-12">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-list dense>
        <DetailField icon="mdi-help-circle-outline" :field="type" :value="fund.address" type="monospace" :allow-copy="true"
          :xl-length="breakPoints[4]" :lg-length="breakPoints[3]" :md-length="breakPoints[2]"
          :sm-length="breakPoints[1]" :xs-length="breakPoints[0]" />
        <DetailField  v-if="fund.signature" icon="mdi-help-circle-outline" field="Signature" :value="fund.signature"
          type="monospace" :xl-length="breakPoints[4]" :lg-length="breakPoints[3]" :md-length="breakPoints[2]"
          :sm-length="breakPoints[1]" :xs-length="breakPoints[0]" />
        <DetailField icon="mdi-help-circle-outline" field="Value" :value="fund.value" type="gwei" />
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Fund } from 'src/types/transaction'
import DetailField from 'src/components/ui/DetailField.vue'
export default defineComponent({
  name: 'FundCard',
  props: {
    funds: { type: Array as PropType<Fund[]>, required: true },
    title: { type: String, required: true },
    breakPoints: { type: Array as PropType<number[]>, default: () => [16, 40, 10, 17, 30] },
    type: {type: String as PropType<'From'|'To'>, required: true}
  },
  components: { DetailField }
})
</script>
