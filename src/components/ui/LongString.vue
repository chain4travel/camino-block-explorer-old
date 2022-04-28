<template>
  <div>
    {{ value && value.length > maxLength ? displayLongString(value, maxLength - 3) : value }}
    <slot></slot>
    <q-tooltip v-if="value && value.length > maxLength">
      {{ value }}
    </q-tooltip>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { displayLongString } from 'src/utils/display-utils'
export default defineComponent({
  name: 'LongString',
  props: {
    value: { type: String, required: false },
    maxLength: { type: Number, default: 32 }
  },
  setup() {
    return {
      displayLongString
    }
  }
})
</script>
