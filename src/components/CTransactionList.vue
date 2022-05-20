<template>
  <ListCard title="Latest Transactions" :items="transactions" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div class="row q-py-sm">
        <div class="gt-xs col-auto text-center q-pr-md">
          <q-icon class="square-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-sm-grow col-12">
          <div>
            <AddressLink class="monospace" :value="item.hash" :to="detailsLinkFunction(item.hash)" :xl-length="32"
              :lg-length="20" :md-length="10" :sm-length="13" :xs-length="12"></AddressLink>
          </div>
          <RelativeTime class="grey-color" :value="item.timestamp"></RelativeTime>
        </div>
        <div :class="'col-sm-grow col-12' + ($q.screen.lt.sm ? ' q-pt-md' : '')">
          <div class="row q-gutter-sm">
            <div class="col-3">From</div>
            <div class="col">
              <AddressLink class="monospace" :to="getAddressDetailsPath(item.from)" :value="item.from"
                :xl-length="26" :lg-length="15" :md-length="7" :sm-length="10" :xs-length="10"></AddressLink>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-3">To </div>
            <div class="col">
              <AddressLink class="monospace" :to="getAddressDetailsPath(item.to)" :value="item.to"
                :xl-length="26" :lg-length="15" :md-length="7" :sm-length="10" :xs-length="10"></AddressLink>
            </div>
          </div>
        </div>
        <div :class="'col-auto justify-end' + ($q.screen.gt.xs ? ' q-px-sm ' : '')">
          <q-chip>
            <q-icon size="sm" :left="true" name="img:/images/camino-coin-logo.png"></q-icon>
            {{ getDisplayValue(item.value) }}
          </q-chip>
        </div>
      </div>
    </template>
  </ListCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import { getDisplayValue } from 'src/utils/currency-utils'
import { getAddressDetailsPath } from 'src/utils/route-utils'
import ListCard from './ui/ListCard.vue'
import { CTransaction } from 'src/types/transaction'
import AddressLink from './ui/AddressLink.vue'
import RelativeTime from './ui/RelativeTime.vue'

export default defineComponent({
  name: 'CTransactionList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    transactions: { type: Array as PropType<CTransaction[]>, required: true },
    showAllLink: { type: String, required: false },
    detailsLinkFunction: { type: Function, required: true }
  },
  setup() {
    return { getRelativeTime, displayLongString, getDisplayValue, getAddressDetailsPath };
  },
  components: { ListCard, AddressLink, RelativeTime }
})
</script>
<style lang="sass" scoped>
</style>
