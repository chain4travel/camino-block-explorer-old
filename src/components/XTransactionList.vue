<template>
  <list-card title="Latest Transactions" :items="transactions"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="col-1">
          <q-icon class="icon-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-3">
          <div>
            {{ displayLongString(item.id, 16) }}</div>
          <q-tooltip>
            {{ item.id }}
          </q-tooltip>
          <div>
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-2">From </div>
            <div v-if="item.from[0]" class="row col-9">
              <div class="col-3">
                <long-string :value="item.from[0].address" :max-length="20"></long-string>
              </div>
              <div class="col-9 text-right">
                <long-string :value="getDisplayValue(item.from[0].value * 1000000000)" :max-length="50">
                  <q-icon class="q-ml-sm" size="sm" name="img:camino-coin-logo.png" />
                </long-string>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2">To </div>
            <div class="col-9">
              <div class="row" :key="item.id" v-for="item in item.to">
                <div class="col-3">
                  <long-string :value="item.address" :max-length="20"></long-string>
                </div>
                <div class="col-9 text-right">
                  <long-string :value="getDisplayValue(item.value * 1000000000)" :max-length="50">
                    <q-icon class="q-ml-sm" size="sm" name="img:camino-coin-logo.png" />
                  </long-string>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2 text-right gas-used">
          <long-string :value="getDisplayValue(item.fee * 1000000000)" :max-length="20">
            <q-icon class="text-red q-ml-sm" size="sm" name="mdi-fire" />
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
  name: 'XTransactionList',
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
