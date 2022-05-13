<template>
  <list-card title="Latest Transactions" :items="transactions" @refresh="() => $emit('refresh')"
    :show-all-link="showAllLink">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" :class="'row'  + ($q.screen.xs ? ' q-py-md' : '')">
          <div class="gt-xs col-auto q-pt-lg q-pr-md">
            <q-icon class="square-background " size="sm" name="mdi-transfer" />
          </div>
          <div class="col-lg-4 col-sm-3 col-12 q-pt-sm">
            <div class="row">
              <div class="col-md-7 col-12">
                <long-string class="monospace" :value="item.id" :xl-length="42" :lg-length="28" :md-length="14" :sm-length="14" :xs-length="28"></long-string>
              </div>
              <div class="col-md-5">
                <q-chip :size="$q.screen.lt.sm ? 'md' :'sm'">{{ item.type }}</q-chip>
              </div>
            </div>
            <div class="q-mt-xs">
              {{ getRelativeTime(item.timestamp) + " ago" }}
            </div>
          </div>
          <div :class="'col-sm-grow col-12'  + ($q.screen.xs ? ' q-py-md' : '')">
            <div class="row items-center">
              <div :class="'col-2'">From </div>
              <div :class="'col'">
                <div class="row items-center" :key="ad.id" v-for="ad in item.from">
                  <div :class="'col self-center' + ($q.screen.xs ? ' col-xs-12' : '')">
                    <long-string class="monospace" :value="ad.address" :xl-length="46" :lg-length="32" :md-length="14" :sm-length="10" :xs-length="28"></long-string>
                  </div>
                  <div :class="'col-auto text-right'">
                    <q-chip >
                      <q-icon :left="true" size="sm" name="img:images/camino-coin-logo.png"></q-icon>
                      {{ getDisplayValueForGewi(ad.value)}}
                      <!-- {{ getDisplayValueForGewi(10000000000000000) }} -->
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>
            <q-separator class="separator-lines" />
            <div :class="'row'">
              <div :class="'col-2 q-pt-sm'">To </div>
              <div :class="'col'">
                <div
                  v-bind:class="{ 'text-grey-8': item.from && item.from[0] && ad.address == item.from[0].address, 'row': true }"
                  :key="ad.id" v-for="ad in item.to">
                  <div :class="'col self-center' + ($q.screen.xs ? ' col-xs-12' : '')">
                    <long-string class="monospace" :value="ad.address" :xl-length="46" :lg-length="32" :md-length="14" :sm-length="10" :xs-length="28"></long-string>
                  </div>
                  <div class="col-auto text-right">
                    <q-chip>
                      <q-icon :left="true" size="sm" name="img:images/camino-coin-logo.png"></q-icon>
                      {{ getDisplayValueForGewi(ad.value)}}
                      <!-- {{ getDisplayValueForGewi(10000000000000000) }} -->
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>
            <q-separator :class="'lt-md' + ($q.screen.xs ? ' q-my-sm' : '')" />
            <div :class="'row lt-md'">
              <div :class="'q-pt-sm'  + ($q.screen.xs ? ' col-xs-2' : ' col')">Fee </div>
              <div :class="'col-auto'">
                    <q-chip >
                      <q-icon :left="true" size="sm" name="img:images/camino-coin-logo.png"></q-icon>
                      {{ getDisplayValueForGewi(item.fee)}}
                      <!-- {{ getDisplayValueForGewi(10000000000000000) }} -->
                    </q-chip></div>
              </div>
          </div>
          <div :class="'col-lg-2 col-md-3 text-right gas-used q-pl-xl gt-sm'">
            <q-chip >
              <q-icon :left="true" size="sm" name="img:images/camino-coin-logo.png"></q-icon>
              {{ getDisplayValueForGewi(item.fee)}}
              <!-- {{ getDisplayValueForGewi(10000000000000000) }} -->
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
