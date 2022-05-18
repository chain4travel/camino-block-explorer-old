<template>
  <list-card title="Latest Transactions" :items="transactions" @refresh="() => $emit('refresh')"
    :show-all-link="showAllLink">
    <template v-slot="{ item }">
      <div :class="'row' + ($q.screen.xs ? ' q-py-md' : '')">
        <div class="gt-xs col-auto q-pt-lg q-pr-md">
          <q-icon class="square-background " size="sm" name="mdi-transfer" />
        </div>
        <div class="col-lg-4 col-sm-3 col-12 q-pt-sm">
          <div class="row">
            <div class="col-md-7 col-lg-9 col-12">
              <AddressLink class="monospace" :value="item.id" :to="detailsLinkFunction(item.id)" :xl-length="50"
                :lg-length="38" :md-length="14" :sm-length="14" :xs-length="25"></AddressLink>
            </div>
            <div class="col-md-5 col-lg-3">
              <q-chip :size="$q.screen.lt.sm ? 'md' : 'sm'">{{ item.type }}</q-chip>
            </div>
          </div>
          <div class="col-md-5 col-lg-3">
            <q-chip :size="$q.screen.lt.sm ? 'md' : 'sm'">{{ item.type }}</q-chip>
          </div>
        </div>
        <div :class="'col-sm-grow col-12' + ($q.screen.xs ? ' q-py-md' : '')">
          <div class="row items-center">
            <div :class="'col-2'">From </div>
            <div :class="'col'">
              <div class="row items-center" :key="ad.id" v-for="ad in item.from">
                <div :class="'col self-center' + ($q.screen.xs ? ' col-xs-12' : '')">
                  <AddressLink class="monospace" :to="getAddressLink(ad.address)" :value="ad.address" :xl-length="50"
                    :lg-length="32" :md-length="14" :sm-length="10" :xs-length="20"></AddressLink>
                </div>
                <div :class="'col-auto text-right'">
                  <q-chip>
                    <q-icon :left="true" size="sm" name="img:/images/camino-coin-logo.png"></q-icon>
                    {{ getDisplayValueForGewi(ad.value) }}
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
                  <AddressLink class="monospace" :to="getAddressLink(ad.address)" :value="ad.address" :xl-length="50"
                    :lg-length="32" :md-length="14" :sm-length="10" :xs-length="20"></AddressLink>
                </div>
                <div class="col-auto text-right">
                  <q-chip>
                    <q-icon :left="true" size="sm" name="img:/images/camino-coin-logo.png"></q-icon>
                    {{ getDisplayValueForGewi(ad.value) }}
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class="'col-lg-2 col-md-3 text-right gas-used q-pl-xl gt-sm'">
        <q-chip>
          <q-icon :left="true" size="sm" name="img:/images/camino-coin-logo.png"></q-icon>
          {{ getDisplayValueForGewi(item.fee) }}
        </q-chip>
      </div>
      <div :class="'col-auto text-right gas-used q-pl-xl gt-sm'">
        <q-chip>
          <q-icon :left="true" size="sm" name="img:/images/camino-coin-logo.png"></q-icon>
          {{ getDisplayValueForGewi(item.fee) }}
        </q-chip>
      </div>
    </template>
  </list-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import { getDisplayValueForGewi } from 'src/utils/currency-utils'
import { getAddressDetailsPath } from 'src/utils/route-utils'

import ListCard from './ListCard.vue'
import { XPTransaction } from 'src/types/transaction'
import AddressLink from './ui/AddressLink.vue'
import { ChainType } from 'src/types/chain-type'

export default defineComponent({
  name: 'XTransactionList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    transactions: { type: Array as PropType<XPTransaction[]>, required: true },
    showAllLink: { type: String, required: false },
    type: { type: String as PropType<ChainType>, required: false },
    detailsLinkFunction: { type: Function, required: true }
  },
  setup(props) {
    return {
      getRelativeTime, displayLongString, getDisplayValueForGewi,
      getAddressLink(value: string): string {
        if (props.type === ChainType.X_CHAIN) {
          return getAddressDetailsPath( 'X-' + value);
        }
        if (props.type === ChainType.P_CHAIN) {
          return getAddressDetailsPath('P-' + value);
        }
        return getAddressDetailsPath(value);
      },
    };
  },
  components: { ListCard, AddressLink }
})
</script>
<style lang="sass" scoped>
.row
  @media (max-width: $breakpoint-sm-max)
    width: 100%
.separator-lines
  opacity: 50%
</style>
