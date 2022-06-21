<template>
  <span
    v-if="
      value &&
      getTargetSize(
        $q.screen.name,
        xlLength,
        lgLength,
        mdLength,
        smLength,
        xsLength
      ) < value.length
    "
  >
    {{
      displayFirstPartLongString(
        value,
        getTargetSize(
          $q.screen.name,
          xlLength,
          lgLength,
          mdLength,
          smLength,
          xsLength
        )
      )
    }}
    &hellip;
    {{
      displaySecondPartLongString(
        value,
        getTargetSize(
          $q.screen.name,
          xlLength,
          lgLength,
          mdLength,
          smLength,
          xsLength
        )
      )
    }}
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
import { defineComponent } from 'vue';
import {
  displayFirstPartLongString,
  displaySecondPartLongString,
} from 'src/utils/display-utils';

function getTargetSize(
  screen: string,
  xlLength: number,
  lgLength: number,
  mdLength: number,
  smLength: number,
  xsLength: number
) {
  switch (screen) {
    case 'xs':
      return xsLength;
    case 'sm':
      return smLength;
    case 'md':
      return mdLength;
    case 'lg':
      return lgLength;
    case 'xl':
      return xlLength;
    default:
      return smLength;
  }
}

export default defineComponent({
  name: 'LongString',
  props: {
    value: { type: [String, Number], required: true },
    xsLength: { type: Number, default: 28 },
    smLength: { type: Number, default: 16 },
    mdLength: { type: Number, default: 9 },
    lgLength: { type: Number, default: 32 },
    xlLength: { type: Number, default: 58 },
  },
  setup() {
    return {
      getTargetSize,
      displayFirstPartLongString,
      displaySecondPartLongString,
    };
  },
});
</script>
