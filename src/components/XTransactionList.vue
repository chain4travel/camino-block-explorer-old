<template>
  <list-card title="Latest Transactions" :items="transactions" @refresh="() => $emit('refresh')"
    :show-all-link="showAllLink">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" :class="'row'  + ($q.screen.lt.md ? ' q-py-md' : '')">
        <div class="gt-sm col-1 q-pt-lg">
          <q-icon class="square-background " size="sm" name="mdi-transfer" />
        </div>
        <div class="col-md-3 col-12">
          <div class="row">
            <div class="col-md-8 col-12">
              <long-string :value="item.id" />
            </div>
            <div class="col-auto">
              <q-chip :size="$q.screen.lt.md ? 'md' :'sm'">{{ item.type }}</q-chip>
            </div>
          </div>
          <div class="q-mt-xs">
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div :class="'col-md-6 col-12' + ($q.screen.lt.md ? ' q-pt-md' : '')">
          <div class="row">
            <div :class="'col-2' + ($q.screen.lt.md ? ' text-bold' : '')">From </div>
            <div :class="$q.screen.lt.md ? ' col-auto' : 'col-md-9'">
              <div class="row" :key="ad.id" v-for="ad in item.from">
                <div class="col-md-7 col-12">
                  <long-string :value="ad.address"></long-string>
                </div>
                <div class="col-md-5 col-auto text-right">
                  <q-chip>
                    <long-string :value="getDisplayValueForGewi(ad.value)" />
                    <q-icon class="q-ml-sm" size="sm" name="img:images/camino-coin-logo.png" />
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
          <q-separator class="separator-lines" />
          <div :class="'row' + ($q.screen.lt.md ? ' q-pt-md' : '')">
            <div :class="'col-2' + ($q.screen.lt.md ? ' text-bold' : '')">To </div>
            <div :class="$q.screen.lt.md ? ' col-auto ' : 'col-md-9'">
              <div
                v-bind:class="{ 'text-grey-8': item.from && item.from[0] && ad.address == item.from[0].address, 'row': true }"
                :key="ad.id" v-for="ad in item.to">
                <div class="col-md-7 col-12">
                  <long-string :value="ad.address"></long-string>
                </div>
                <div class="col-md-5 col-auto text-right">
                  <q-chip>
                    <long-string :value="getDisplayValueForGewi(ad.value)" />
                    <q-icon class="q-ml-sm" size="sm" name="img:images/camino-coin-logo.png" />
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="'col-md-2 col-auto text-right gas-used' + ($q.screen.lt.md ? ' q-pt-md' : ' q-pt-md')">
          <q-chip>
            <long-string :value="getDisplayValueForGewi(item.fee)" :max-length="2" />
            <q-icon class="text-red q-ml-sm" size="sm" name="img:images/camino-coin-logo.png" />
          </q-chip>
        </div>
      </div>
    </template>
  </list-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import { getDisplayValueForGewi } from 'src/utils/currency-utils'

import ListCard from './ListCard.vue'
import { XPTransaction } from 'src/types/transaction'
import LongString from './ui/LongString.vue'

export default defineComponent({
  name: 'XTransactionList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    transactions: { type: Array as PropType<XPTransaction[]>, required: true },
    showAllLink: { type: String, required: false },
    showType: { type: Boolean, default: false }
  },
  setup() {
    return { getRelativeTime, displayLongString, getDisplayValueForGewi };
  },
  components: { ListCard, LongString }
})
</script>
<style lang="sass" scoped>
.row
  @media (max-width: $breakpoint-sm-max)
    width: 100%
.separator-lines
  opacity: 50%
</style>
