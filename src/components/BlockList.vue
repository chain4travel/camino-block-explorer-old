<template>
  <ListCard :title="title || 'Latest Blocks'" :items="blocks" :show-all-link="showAllLink"
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
          <RelativeTime class="grey-color" :value="item.timestamp"></RelativeTime>
        </div>
        <div :class="'col-sm-grow col-12'+ ($q.screen.xs ? ' q-pt-md':'')">
          <div>
            {{ item.numberOfTransactions + " txns" }}
          </div>
          <LongString class="monospace" :value="item.hash" :xl-length="58" :lg-length="32" :md-length="9" :sm-length="16" :xs-length="16"></LongString>
        </div>
        <div :class="'col-auto self-center justify-end'+ ($q.screen.gt.xs ? ' q-px-sm ':'')">
          <CamAmount :value="item.gasUsed" />
        </div>
      </div>
    </template>
  </ListCard>
</template>

<script lang="ts">
import { BlockTableData } from 'src/types/block'
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import ListCard from './ui/ListCard.vue'
import LongString from './ui/LongString.vue'
import AddressLink from  './ui/AddressLink.vue'
import CamAmount from './ui/CamAmount.vue'
import RelativeTime from './ui/RelativeTime.vue'

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
      getRelativeTime, displayLongString, AddressLink
    };
  },
  components: { ListCard, LongString, AddressLink, RelativeTime, CamAmount }
})
</script>
