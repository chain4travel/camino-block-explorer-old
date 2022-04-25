<template>
  <div>
    {{ value.length > maxLength ? displayLongString(value, maxLength - 3) : value }}
    <q-tooltip v-if="value.length > maxLength">
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
    value: { type: String, required: true },
    maxLength: { type: Number, default: 32 }
  },
  setup() {
    return {
      displayLongString
    }
  }
})
</script>
