<template>
  <div v-if="value">
    {{ value }}
    <slot></slot>
  </div>
  <v-else>
    <q-icon class="q-ml-sm text-grey" size="xs" name="mdi-circle-off-outline" />
  </v-else>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'OptionalString',
  props: {
    value: { type: String, required: false }
  },
  setup() {
    return {
    }
  }
})
</script>
