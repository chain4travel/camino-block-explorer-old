<template>
  <q-item>
    <div class="row">
      <div class="col-md-3 col-12 text-bold">
        <q-icon class="gt-sm grey-color" v-if="icon" size="sm" :name="icon">
          <q-tooltip v-if="tooltip">
            {{ tooltip }}
          </q-tooltip>
        </q-icon>
        <span :class="$q.screen.gt.sm ? 'q-pl-md' : ''">
          {{ field }}
        </span>
      </div>
      <div class="col-md col-auto">
        <div v-if="value === undefined || value === ''">
          <q-icon class="text-grey" size="xs" name="mdi-circle-off-outline" />
        </div>
        <div v-else-if="type == 'string'">
          <long-string :value="value" :max-length="16"></long-string>
        </div>
        <div v-else-if="type == 'txstatus'">
          <q-icon :class="getStatusClass(value)" size="xs" :name="getStatusIcon(value)">
            <q-tooltip>
              {{ value }}
            </q-tooltip>
          </q-icon>
        </div>
        <div v-else-if="type == 'txtype'">
          <div>
            <div class="row ">
              <div class="col-auto">
                <q-chip size="md">{{ value }}</q-chip>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="type == 'timestamp'">
          <div class="row">
            <div class="q-pr-md col-auto">
              <q-icon class="q-pr-sm" size="xs" name="mdi-clock-outline" />{{ getRelativeTime(value) }} ago
            </div>
            <div class="col-auto">
              <long-string :value="value" :max-length="16" />
            </div>
          </div>
        </div>
        <div v-else-if="type == 'gwei'">
          <div class="row">
            <div class="col-auto">
              <q-chip class="q-chip-camino" size="md" icon="img:camino-coin-logo.png">
                {{ getDisplayValueForGewi(value) }}
              </q-chip>
            </div>
          </div>
        </div>
        <div v-else-if="type == 'wei'">
          <div class="row">
            <div class="col-auto">
              <q-chip class="q-chip-camino" icon="img:camino-coin-logo.png">
                {{ getDisplayValue(value) }}
              </q-chip>
            </div>
          </div>
        </div>
        <div v-else-if="type == 'ctxtype'">
          <div class="row">
            <div class="col-auto">
              <q-chip size="md">{{ value == 0 ? 'Legacy' : 'EIP1155' }}</q-chip>
            </div>
          </div>
        </div>
        <div v-else-if="type == 'hexdata'">
          <q-icon v-if="parseInt(value) === 0" class="q-ml-sm text-grey" size="xs" name="mdi-circle-off-outline" />
          <long-string v-else :value="value" />
        </div>
      </div>
      <div v-if="detailsLink" class="col-md col-12 text-right">
        <q-btn size="sm" color="primary" outline rounded icon="search" :to="detailsLink">Details</q-btn>
      </div>
    </div>
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
  props: {
    field: { type: String, required: true },
    value: { type: [String, Number, Object], required: false },
    type: { type: String, required: true },
    icon: { type: String, required: false },
    tooltip: { type: String, required: false },
    detailsLink: { type: String, required: false },
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
<style scoped lang="sass" >
.row
  width: 100%

.q-chip
  margin-left: 0px

.q-icon
  margin-left: 0px
</style>
