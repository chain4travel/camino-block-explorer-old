<template>
  <list-card :title="title || 'Latest Blocks'" :items="blocks" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div class="row q-py-sm">
        <div class="gt-xs col-auto text-center m q-pr-md">
          <q-icon class="square-background" size="sm" name="mdi-cube-outline" />
        </div>
        <div class="col-lg-2 col-sm-3 q-pr-lg col-12">
          <div>
            <AddressLink :value="item.number" :to="detailsLinkFunction(item.number)"></AddressLink>
          </div>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div :class="'col-sm-grow col-12'+ ($q.screen.xs ? ' q-pt-md':'')">
          <div>
            {{ item.numberOfTransactions + " txns" }}
          </div>
          <long-string class="grey-color monospace" :value="item.hash" :xl-length="58" :lg-length="32" :md-length="9" :sm-length="16" :xs-length="28"></long-string>
        </div>
        <div :class="'col-auto justify-end'+ ($q.screen.gt.xs ? ' q-px-sm ':'')">
          <q-chip >
            <q-icon :left="true" size="sm" name="img:/images/camino-coin-logo.png"></q-icon>
            {{ getDisplayValue(item.gasUsed) }}
            <!-- {{ getDisplayValue(10000000000000000000000000) }} -->
          </q-chip>
        </div>
      </div>
    </template>

  </list-card>
</template>

<script lang="ts">
import { BlockTableData } from 'src/types/block'
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import { getDisplayValue } from 'src/utils/currency-utils'
import ListCard from './ListCard.vue'
import LongString from './ui/LongString.vue'
import AddressLink from  './ui/AddressLink.vue'

export default defineComponent({
  name: 'BlockList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    blocks: { type: Array as PropType<BlockTableData[]>, required: true },
    showAllLink: { type: String, required: false },
    detailsLinkFunction: {type: Function, required: true}
  },
  setup() {
    return {
      getRelativeTime, displayLongString, getDisplayValue, AddressLink
    };
  },
  components: { ListCard, LongString, AddressLink}
})
</script>
<style lang="sass" scoped>
.large-chip
  @media (max-width: $breakpoint-sm-max)
    min-width: 50px
.row
  @media (max-width: $breakpoint-sm-max)
    width: 100%


</style>
