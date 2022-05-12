<template>
  <list-card :title="title || 'Latest Blocks'" :items="blocks" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row q-py-sm">
        <div class="gt-sm col-auto text-center m q-pr-md">
          <q-icon class="square-background" size="sm" name="mdi-cube-outline" />
        </div>
        <div class="col-lg-2 col-md-3 q-pr-lg col-12">
          <div>
            {{ item.number }}
          </div>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div :class="'col-md-grow col-12'">
          <div>
            {{ item.numberOfTransactions + " txns" }}
          </div>
          <long-string class="grey-color monospace" :value="item.hash" :xl-length="58" :lg-length="32" :md-length="9" :sm-length="10"></long-string>
        </div>
        <div class="col-auto q-px-sm justify-end">
          <q-chip >
            <q-icon :left="true" size="sm" name="img:camino-coin-logo.png"></q-icon>
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

export default defineComponent({
  name: 'BlockList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    blocks: { type: Array as PropType<BlockTableData[]>, required: true },
    showAllLink: { type: String, required: false }
  },
  setup() {
    return {
      getRelativeTime, displayLongString, getDisplayValue
    };
  },
  components: { ListCard, LongString }
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
