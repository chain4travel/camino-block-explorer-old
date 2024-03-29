<template>
  <ListCard
    :title="title"
    :items="transactions"
    :show-all-link="showAllLink"
    hideRefresh
  >
    <template v-slot="{ item }">
      <div class="row q-py-sm">
        <div class="gt-xs col-auto text-center q-pr-md">
          <q-icon class="square-background" size="sm" name="mdi-transfer" />
        </div>
        <div class="col-sm-grow col-12">
          <div>
            <AddressLink
              class="monospace"
              :value="item.hash"
              :to="detailsLinkFunction(item.hash)"
              :xl-length="37"
              :lg-length="20"
              :md-length="10"
              :sm-length="20"
              :xs-length="12"
            ></AddressLink>
          </div>
          <RelativeTime
            class="grey-color"
            :value="item.timestamp"
          ></RelativeTime>
        </div>
        <div
          :class="'col-sm-grow col-12' + ($q.screen.lt.sm ? ' q-pt-md' : '')"
        >
          <div class="row q-gutter-sm">
            <div class="col-3">From</div>
            <div class="col">
              <AddressLink
                class="monospace"
                :to="getAddressDetailsPath(item.from)"
                :value="item.from"
                :xl-length="25"
                :lg-length="15"
                :md-length="7"
                :sm-length="15"
                :xs-length="10"
              ></AddressLink>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col-3">To</div>
            <div class="col">
              <AddressLink
                class="monospace"
                :to="getAddressDetailsPath(item.to)"
                :value="item.to"
                :xl-length="25"
                :lg-length="15"
                :md-length="7"
                :sm-length="15"
                :xs-length="10"
              ></AddressLink>
            </div>
          </div>
        </div>
        <div
          :class="
            'col-auto self-center justify-end' +
            ($q.screen.gt.xs ? ' q-px-sm ' : '')
          "
        >
          <CamAmount :value="item.transactionCost" />
        </div>
      </div>
    </template>
  </ListCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { getRelativeTime, displayLongString } from 'src/utils/display-utils';
import { getAddressDetailsPath } from 'src/utils/route-utils';
import ListCard from './ui/ListCard.vue';
import { CTransaction } from 'src/types/transaction';
import AddressLink from './ui/AddressLink.vue';
import CamAmount from './ui/CamAmount.vue';
import RelativeTime from './ui/RelativeTime.vue';

export default defineComponent({
  name: 'CTransactionList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, default: 'Latest Transactions' },
    transactions: { type: Array as PropType<CTransaction[]>, required: true },
    showAllLink: { type: String, required: false },
    detailsLinkFunction: { type: Function, required: true },
    hideRefresh: { type: Boolean, default: false },
  },
  setup() {
    return { getRelativeTime, displayLongString, getAddressDetailsPath };
  },
  components: { ListCard, AddressLink, RelativeTime, CamAmount },
});
</script>
<style lang="sass" scoped></style>
