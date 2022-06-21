<template>
  <span>
    {{ getRelativeTime(value) + ' ago' }}
    <q-tooltip :v-if="'value'">
      {{ value }}
    </q-tooltip>
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getRelativeTime } from 'src/utils/display-utils';

export default defineComponent({
  name: 'RelativeTime',
  props: {
    value: { type: Date, required: true },
  },
  setup() {
    return {
      getRelativeTime,
    };
  },
});
</script>
