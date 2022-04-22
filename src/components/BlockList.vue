<template>
  <list-card :title="title || 'Latest Blocks'" :items="blocks" @refresh="() => $emit('refresh')">
    <template v-slot="{ item }">
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
        {{ item.transactions }}<br>
        {{ displayLongString(item.hash) }}
        <q-tooltip>
          {{ item.hash }}
        </q-tooltip>
      </div>
      <div class="col-2 burn-icon">
        <q-icon class="text-red" size="sm" name="mdi-fire" />
        {{ item.burned }} WEI
      </div>
    </template>
  </list-card>
</template>

<script lang="ts">
import { Block } from 'src/types/block'
import { defineComponent, PropType } from 'vue'
import { getRelativeTime, displayLongString } from 'src/utils/display-utils'
import ListCard from './ListCard.vue'

export default defineComponent({
  name: 'BlockList',
  emits: ['refresh'],
  props: {
    title: { type: String, required: false },
    blocks: { type: Array as PropType<Block[]>, required: true }
  },
  setup() {
    return { getRelativeTime, displayLongString };
  },
  components: { ListCard }
})
</script>
