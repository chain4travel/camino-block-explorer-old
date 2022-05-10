<template>
  <list-card title="Latest Transactions" :items="transactions" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="gt-sm col-1 text-center q-pt-sm q-pb-sm">
          <q-icon class="square-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-md-5 col-12 ">
          <div>
            <long-string :value="item.hash"></long-string>
          </div>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago"}}
          </div>
        </div>
        <div :class="'col-md-4 col-12'+ ($q.screen.lt.md ? ' q-pt-md':'')">
          <div class="row">
            <div class="col-md-3 col-2">From </div>
            <div class="col-md-9 col-10">
              <long-string class="grey-color" :value="item.from" :max-length="26"></long-string>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 col-2">To </div>
            <div class="col-md-9 col-10">
              <long-string class="grey-color" :value="item.to" :max-length="26"></long-string>
            </div>
          </div>
        </div>
        <div class="col-auto q-pt-sm">
          <q-chip class="large-chip justify-end" icon="img:images/camino-coin-logo.png">
            <long-string class="" :value="getDisplayValue(item.value)">
            </long-string>
          </q-chip>
        </div>
      </div>
    </template>
  </list-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import { getDisplayValue } from 'src/utils/currency-utils'

import ListCard from './ListCard.vue'
import { CTransaction } from 'src/types/transaction'
import LongString from './ui/LongString.vue'

export default defineComponent({
  name: 'TransactionList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    transactions: { type: Array as PropType<CTransaction[]>, required: true },
    showAllLink: { type: String, required: false }
  },
  setup() {
    return { getRelativeTime, displayLongString, getDisplayValue };
  },
  components: { ListCard, LongString }
})
</script>
<style lang="sass" scoped>
.row
  @media (max-width: $breakpoint-sm-max)
  width: 100%

</style>
