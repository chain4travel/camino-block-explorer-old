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
            <div class="col-9">
              <div class="row" :key="ad.id" v-for="ad in item.from">
                <div class="col-3">
                  <long-string :value="ad.address" :max-length="20"></long-string>
                </div>
                <div class="col-9 text-right">
                  <long-string  :value="getDisplayValue(ad.value * 1000000000)" :max-length="50">
                    <q-icon class="q-ml-sm" size="sm" name="img:camino-coin-logo.png" />
                  </long-string>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2">To </div>
            <div class="col-9">
              <div v-bind:class="{'text-grey-8': item.from && item.from[0] && ad.address == item.from[0].address, 'row': true}" :key="ad.id" v-for="ad in item.to">
                <div class="col-3">
                  <long-string :value="ad.address" :max-length="20"></long-string>
                </div>
                <div class="col-9 text-right">
                  <long-string :value="getDisplayValue(ad.value * 1000000000)" :max-length="50">
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
import { XTransaction } from 'src/types/transaction'
import LongString from './ui/LongString.vue'

export default defineComponent({
  name: 'XTransactionList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    transactions: { type: Array as PropType<XTransaction[]>, required: true },
    detailsLink: { type: String, required: false }
  },
  setup() {
    return { getRelativeTime, displayLongString, getDisplayValue };
  },
  components: { ListCard, LongString }
})
</script>
