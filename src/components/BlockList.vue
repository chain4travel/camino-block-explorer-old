<template>
  <list-card :title="title || 'Latest Blocks'" :items="blocks" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="gt-sm col-1 text-center q-pt-sm q-pb-sm">
          <q-icon class="square-background" size="sm" name="mdi-cube-outline" />
        </div>
        <div class="col-md-2 col-12">
          <div>
            {{ item.number }}</div>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div :class="'col-md-7 col-12' + ($q.screen.lt.md ? ' q-pt-md' : '')">
          <div>
            {{ item.numberOfTransactions + " txns" }}
          </div>
          <long-string class="grey-color" :value="item.hash" :max-length="45"></long-string>
        </div>
        <div class="col-md-2 col-auto q-pt-sm">
          <q-chip class="large-chip justify-end">
            <q-icon class="q-pr-sm" size="sm" name="img:/images/camino-coin-logo.png"></q-icon>
            {{ getDisplayValue(item.gasUsed) }}
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
