<template>
  <list-card :title="title || 'Latest Blocks'" :items="blocks" @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
      <div @click="() => $emit('row-clicked', item)" class="row">
        <div class="col-1">
          <q-icon class="icon-background" size="sm" name="mdi-cube-outline" />
        </div>
        <div class="col-6">
          <div>
            {{ item.height }}</div>
          <div>
            {{ getRelativeTime(item.timestamp) + " ago" }}
          </div>
        </div>
        <div class="col-3">
          {{ item.transactions.length }}<br>
          <long-string :value="item.hash" :max-length="15"></long-string>
        </div>
        <div class="col-2 burn-icon">
          {{ getDisplayValue(item.gasUsed) }}
          <q-icon class="q-ml-sm" size="sm" name="img:camino-coin-logo.png" />
        </div>
      </div>
    </template>
  </list-card>
</template>

<script lang="ts">
import { Block } from 'src/types/block'
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import { getDisplayValue } from 'src/utils/currency-conversion'
import ListCard from './ListCard.vue'
import LongString from './ui/LongString.vue'

export default defineComponent({
  name: 'BlockList',
  emits: ['refresh', 'row-clicked'],
  props: {
    title: { type: String, required: false },
    blocks: { type: Array as PropType<Block[]>, required: true }
  },
  setup() {
    return { getRelativeTime, displayLongString, getDisplayValue };
  },
  components: { ListCard, LongString }
})
</script>
