<template>
  <list-card title="Latest Transactions" :items="transactions" @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
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
          <div class="col-9">{{ displayLongString(item.originAdress) }}
            <q-tooltip>
              {{ item.originAdress }}
            </q-tooltip>
          </div>
        </div>
        <div class="row">
          <div class="col-3">To </div>
          <div class="col-9">{{ displayLongString(item.destinationAdress) }}
            <q-tooltip>
              {{ item.destinationAdress }}
            </q-tooltip>
          </div>
        </div>
      </div>
      <div class="col-2 gas-used">
        <q-icon class="text-red" size="sm" name="img:src/assets/camino-coin-logo.png" />
        {{ item.fee }} CAM
      </div>
    </template>
  </list-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import ListCard from './ListCard.vue'
import { Transaction } from 'src/types/transaction'

export default defineComponent({
  name: 'TransactionList',
  emits: ['refresh'],
  props: {
    title: { type: String, required: false },
    transactions: { type: Array as PropType<Transaction[]>, required: true }
  },
  setup() {
    return { getRelativeTime, displayLongString };
  },
  components: { ListCard }
})
</script>
