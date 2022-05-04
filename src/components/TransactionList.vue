<template>
  <list-card title="Latest Transactions" :items="transactions" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="col-1 text-center q-pt-sm q-pb-sm">
          <q-icon class="square-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-5 q-pl-sm">

          <div>
            <long-string :value="item.hash"></long-string>
          </div>
          <q-tooltip>
            {{ item.hash }}
          </q-tooltip>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div class="col-4">
          <div class="row">
            <div class="col-3">From </div>
            <div class="col-9">
              <long-string class="grey-color" :value="item.from" :max-length="26"></long-string>
            </div>
          </div>
          <div class="row">
            <div class="col-3">To </div>
            <div class="col-9">
              <long-string class="grey-color" :value="item.to" :max-length="26"></long-string>
            </div>
          </div>
        </div>
        <div class="col-2 gas-used q-pt-sm">
          <q-chip class="large-chip" icon="img:camino-coin-logo.png">
            <long-string class="text-right" :value="getDisplayValue(item.value)" :max-length="12">
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
