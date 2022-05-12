<template>
  <list-card title="Latest Transactions" :items="transactions" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row q-py-sm">
        <div class="gt-xs col-auto text-center q-pr-md">
          <q-icon class="square-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-sm-grow col-12">
          <div>
            <long-string class="monospace" :value="item.hash" :xl-length="32" :lg-length="20"  :md-length="9" :sm-length="12" :xs-length="26"></long-string>
          </div>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago"}}
          </div>
        </div>
        <div :class="'col-sm-grow col-12'+ ($q.screen.lt.sm ? ' q-pt-md':'')">
          <div class="row q-gutter-sm">
            <div class="col-3">From</div>
            <div class="col">
              <long-string class="grey-color monospace" :value="item.from"  :xl-length="26" :lg-length="15"  :md-length="7" :sm-length="10" :xs-length="20"></long-string>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-3">To </div>
            <div class="col">
              <long-string class="grey-color monospace" :value="item.to"  :xl-length="26" :lg-length="15"  :md-length="7" :sm-length="10" :xs-length="20"></long-string>
            </div>
          </div>
        </div>
        <div :class="'col-auto justify-end' + ($q.screen.gt.xs ? ' q-px-sm ':'')">
          <q-chip>
            <q-icon size="sm" :left="true" name="img:images/camino-coin-logo.png"></q-icon>
            {{ getDisplayValue(item.value) }}
            <!-- {{ getDisplayValue(10000000000000000000000000) }} -->
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
