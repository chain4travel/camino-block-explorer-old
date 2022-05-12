<template>
    <span>
      {{ displayFirstPartLongString(value, $q.screen.gt.lg ? xlLength: ($q.screen.gt.md ? lgLength:  ($q.screen.gt.sm ? mdLength: smLength))) }}&hellip;{{ displaySecondPartLongString(value, $q.screen.gt.lg ? xlLength: ($q.screen.gt.md ? lgLength:  ($q.screen.gt.sm ? mdLength: smLength))) }}
      <!-- {{ displayLongString(value, length) }} -->
      <q-tooltip v-if="value">
        {{ value }}
      </q-tooltip>
      <slot></slot>
    </span>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { displayLongString, displayFirstPartLongString, displaySecondPartLongString } from 'src/utils/display-utils'
export default defineComponent({
  name: 'LongString',
  props: {
    value: { type: String, required: true },
    smLength: {type: Number, required: true},
    mdLength: {type: Number, required: true},
    lgLength: {type: Number, required: true},
    xlLength: {type: Number, required: true}
  },
  setup() {
    return {
      displayLongString, displayFirstPartLongString, displaySecondPartLongString
    }
  }
})
</script>
