<template>
  <q-item>
    <q-item-section class="col-2">
      {{ field }}
    </q-item-section>
    <q-item-section v-if="value === undefined" class="col-10">
      <q-icon class="q-ml-sm text-grey" size="xs" name="mdi-circle-off-outline" />
    </q-item-section>
    <q-item-section v-else-if="type == 'string'" class="col-10">
      {{ value }}
    </q-item-section>
    <q-item-section v-else-if="type == 'txstatus'" class="col-10">
      <q-icon :class="getStatusClass(value)" size="xs" :name="getStatusIcon(value)">
          <q-tooltip>
          {{ value }}
        </q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section v-else-if="type == 'txtype'" class="col-10">
      <long-string :value="value" :max-length="16"><q-chip size="sm">{{ value }}</q-chip></long-string>
       <!-- <q-icon :class="getStatusClass(value)" size="xs" :name="getStatusIcon(value)" /> -->
    </q-item-section>
    <q-item-section v-else-if="type == 'timestamp'" class="col-10">
        <div class="row">
          <div class="q-pr-md"><q-icon class="q-ml-sm q-pr-sm" size="xs" name="mdi-clock-outline" />{{ getRelativeTime(value) }} ago</div>
          (<long-string :value="value" :max-length="16">{{ value }}</long-string>)
        </div>
       <!-- <q-icon :class="getStatusClass(value)" size="xs" :name="getStatusIcon(value)" /> -->
    </q-item-section>
    <q-item-section v-else-if="type == 'gwei'" class="col-10">
      {{ getDisplayValueForGewi(value) }}
    </q-item-section>
  </q-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { getDisplayValueForGewi } from 'src/utils/currency-utils'

function getStatusIcon(status: string) {
  if(status === 'accepted') {
    return 'mdi-check-circle-outline';
  } else {
    return 'mdi-help-circle-outline';
  }
}

function getStatusClass(status: string) {
  let css = 'q-ml-sm ';
  if(status === 'accepted') {
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
    value: { type: [String, Number, Object], required: true },
    type: { type: String, required: true },
  },
  setup(props) {
    return {
        getStatusIcon,
        getStatusClass,
        getRelativeTime,
        getDisplayValueForGewi
    }
  }
})
</script>

<!-- <style scoped lang="sass">
*
  background: $background-card
  color: white
.limit-height
  min-height: 70px
</style> -->
