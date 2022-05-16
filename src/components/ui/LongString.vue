<template>
    <span v-if="value && getTargetSize($q.screen.name, xlLength, lgLength, mdLength, smLength, xsLength) < value.length">
      {{ displayFirstPartLongString(value, getTargetSize($q.screen.name, xlLength, lgLength, mdLength, smLength, xsLength)) }}&hellip;{{ displaySecondPartLongString(value, getTargetSize($q.screen.name, xlLength, lgLength, mdLength, smLength, xsLength)) }}
      <q-tooltip :v-if="'value'">
        {{ value }}
      </q-tooltip>
      <slot></slot>
    </span>
    <span v-else>
      {{ value }}
      <slot></slot>
    </span>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { displayLongString, displayFirstPartLongString, displaySecondPartLongString } from 'src/utils/display-utils'

function getTargetSize(screen: string, xlLength: number, lgLength: number, mdLength: number, smLength: number, xsLength: number) {
  switch(screen) {
    case 'xs': return xsLength;
    case 'sm': return smLength;
    case 'md': return mdLength;
    case 'lg': return lgLength;
    case 'xl': return xlLength;
    default: return smLength;
  }
}

export default defineComponent({
  name: 'LongString',
  props: {
    value: { type: String, required: true },
    xsLength: {type: Number, required: true},
    smLength: {type: Number, required: true},
    mdLength: {type: Number, required: true},
    lgLength: {type: Number, required: true},
    xlLength: {type: Number, required: true}
  },
  setup() {
    return {
      displayLongString, getTargetSize, displayFirstPartLongString, displaySecondPartLongString
    }
  }
})
</script>
