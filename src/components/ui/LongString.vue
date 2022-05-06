<template>
    <span class="overflow-handle">
      {{ value }}
      <q-tooltip v-if="value">
        {{ value }}
      </q-tooltip>
      <slot></slot>
    </span>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { displayLongString } from 'src/utils/display-utils'
export default defineComponent({
  name: 'LongString',
  props: {
    value: { type: [String, Number], required: false },
  },
  setup() {
    return {
      displayLongString
    }
  }
})
</script>
<style lang="sass" scoped>
.overflow-handle
  display: inline-block
  white-space: nowrap
  width: 100%
  overflow: hidden
  -o-text-overflow: ellipsis
  text-overflow: ellipsis
  @media (max-width: $breakpoint-sm-max)
    width: 100%
</style>
