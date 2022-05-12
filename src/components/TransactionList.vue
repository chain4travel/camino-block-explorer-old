<template>
  <list-card title="Latest Transactions" :items="transactions" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="gt-sm col-auto text-center q-py-sm  q-pr-md">
          <q-icon class="square-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-md-grow col-12 ">
          <div>
            <long-string class="monospace" :value="item.hash" :xl-length="32" :lg-length="20"  :md-length="9" :sm-length="6" ></long-string>
          </div>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago"}}
          </div>
        </div>
        <div :class="'col-md-grow col-12'">
          <div class="row q-gutter-sm">
            <div class="col-md-3">From</div>
            <div class="col">
              <long-string class="grey-color monospace" :value="item.from"  :xl-length="26" :lg-length="16"  :md-length="8" :sm-length="10"></long-string>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-md-3 col-2">To </div>
            <div class="col">
              <long-string class="grey-color monospace" :value="item.to"  :xl-length="26" :lg-length="16"  :md-length="8" :sm-length="10"></long-string>            </div>
          </div>
        </div>
        <div class="col-auto q-pt-sm justify-end">
          <q-chip>
            <q-icon size="sm" name="img:camino-coin-logo.png"></q-icon>
            <!-- {{ getDisplayValue(item.value) }} -->
            {{ getDisplayValue(1000000000000000000000000) }}

            <!-- <long-string class="" :value="getDisplayValue(item.value)">
            </long-string> -->
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
</style>
