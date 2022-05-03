<template>
  <list-card :title="title || 'Latest Blocks'" :items="blocks" :show-all-link="showAllLink"
    @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="col-1 square icon-background text-center">
          <q-icon size="sm" name="mdi-cube-outline" />
        </div>
        <div class="col-3 q-pl-sm">
          <div>
            {{ item.height }}</div>
          <div class="grey-color">
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div class="col-6">
          {{ item.transactions.length + " txns" }}<br>
          <long-string class="grey-color" :value="item.hash" :max-length="45"></long-string>
        </div>
        <div class="col-2 burn-icon">
          <q-chip class="q-chip-bg text-right justify-end" icon-right="img:camino-coin-logo.png">
            {{ getDisplayValue(item.gasUsed) }}
          </q-chip>
        </div>
      </div>
    </template>
  </list-card>
</template>

<script lang="ts">
import { Block } from 'src/types/block'
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
    blocks: { type: Array as PropType<Block[]>, required: true },
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
.q-chip-bg
  background: rgba(255, 255, 255, 0.15)
  color: white
  border-radius: 99px
  min-width: 120px
  text-align: end
.grey-color
  opacity: 60%
.icon-background
  background: #2E3234
  padding: 10px
.square:before
  display: block
  padding-top: 100%
  background: #2E3234
</style>
