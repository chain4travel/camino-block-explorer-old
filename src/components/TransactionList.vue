<template>
  <list-card title="Latest Transactions" :items="transactions" :details-link="detailsLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="col-1">
          <q-icon class="icon-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-6">
          <div>
            {{ displayLongString(item.hash, 30) }}</div>
          <q-tooltip>
            {{ item.hash }}
          </q-tooltip>
          <div>
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <div class="col-3">From </div>
            <div class="col-9">
              <long-string :value="item.from" :max-length="15"></long-string>
            </div>
          </div>
          <div class="row">
            <div class="col-3">To </div>
            <div class="col-9">
              <long-string :value="item.to" :max-length="15"></long-string>
            </div>
          </div>
        </div>
        <div class="col-2 gas-used">
          <long-string :value="getDisplayValue(item.value)" :max-length="12">
            <q-icon class="q-ml-sm" size="sm" name="img:camino-coin-logo.png" />
          </long-string>

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
import { Transaction } from 'src/types/transaction'
import LongString from './ui/LongString.vue'

export default defineComponent({
  name: 'TransactionList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    transactions: { type: Array as PropType<Transaction[]>, required: true },
    detailsLink: { type: String, required: false }
  },
  setup() {
    return { getRelativeTime, displayLongString, getDisplayValue };
  },
  components: { ListCard, LongString }
})
</script>
