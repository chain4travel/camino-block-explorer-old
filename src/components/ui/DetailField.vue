<template>
  <q-item>
    <q-item-section class="col-2">
      {{ field }}
    </q-item-section>
    <q-item-section v-if="value === undefined" class="col-10">
      <q-icon class="q-ml-sm text-grey" size="xs" name="mdi-circle-off-outline" />
    </q-item-section>
    <q-item-section v-else-if="type == 'string'" class="col-10">
      <long-string :value="value" :max-length="16"></long-string>
    </q-item-section>
    <q-item-section v-else-if="type == 'txstatus'" class="col-10">
      <q-icon :class="getStatusClass(value)" size="xs" :name="getStatusIcon(value)">
        <q-tooltip>
          {{ value }}
        </q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section v-else-if="type == 'txtype'" class="col-10">
      <div>
        <q-chip size="sm">{{ value }}</q-chip>
      </div>
    </q-item-section>
    <q-item-section v-else-if="type == 'timestamp'" class="col-10">
      <div class="row">
        <div class="q-pr-md">
          <q-icon class="q-ml-sm q-pr-sm" size="xs" name="mdi-clock-outline" />{{ getRelativeTime(value) }} ago
        </div>
        <div>
          <long-string :value="value" :max-length="16" />
        </div>
      </div>
    </q-item-section>
    <q-item-section v-else-if="type == 'gwei'" class="col-10">
      <div class="row">
        <q-icon class="q-ml-sm q-pr-sm" size="sm" name="img:camino-coin-logo.png" />
        {{ getDisplayValueForGewi(value) }}
      </div>
    </q-item-section>
    <q-item-section v-else-if="type == 'wei'" class="col-10">
      <div class="row">
        <q-icon class="q-ml-sm q-pr-sm" size="sm" name="img:camino-coin-logo.png" />
        {{ getDisplayValue(value) }}
      </div>
    </q-item-section>
    <q-item-section v-else-if="type == 'ctxtype'" class="col-10">
      <div>
        <q-chip size="sm">{{ value == 0 ? 'Legacy' : 'EIP1155' }}</q-chip>
      </div>
    </q-item-section>
    <q-item-section v-else-if="type == 'hexdata'" class="col-10">
      <q-icon v-if="parseInt(value) === 0" class="q-ml-sm text-grey" size="xs" name="mdi-circle-off-outline" />
      <long-string v-else :value="value" />
    </q-item-section>

  </q-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { getDisplayValueForGewi, getDisplayValue } from 'src/utils/currency-utils'
import LongString from 'src/components/ui/LongString.vue'

function getStatusIcon(status: string) {
  if (status === 'accepted') {
    return 'mdi-check-circle-outline';
  } else {
    return 'mdi-help-circle-outline';
  }
}

function getStatusClass(status: string) {
  let css = 'q-ml-sm ';
  if (status === 'accepted') {
    css = css + 'text-green';
  } else {
    css = css + 'text-blue';
  }
  return css
}

export default defineComponent({
  name: 'DetailField',
  // emits: ['refresh'],
  props: {
    field: { type: String, required: true },
    value: { type: [String, Number, Object], required: false },
    type: { type: String, required: true },
  },
  setup(props) {
    return {
      getStatusIcon,
      getStatusClass,
      getRelativeTime,
      getDisplayValueForGewi,
      getDisplayValue
    }
  },
  components: { LongString }
})
</script>

<!-- <style scoped lang="sass">
*
  background: $background-card
  color: white
.limit-height
  min-height: 70px
</style> -->
