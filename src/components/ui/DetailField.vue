<template>
  <q-item>
    <div class="row q-gutter-sm">
      <div class="col-md-4 col-12 text-bold">
        <div class="row">
          <q-icon class="col-2 gt-sm grey-color" v-if="icon" size="xs" :name="icon">
            <q-tooltip v-if="tooltip">
              {{ tooltip }}
            </q-tooltip>
          </q-icon>
          <span :class="'col overflow-handle ' + ($q.screen.lt.md ? '' : 'q-pl-md')">
            {{ field }}
          </span>
        </div>
      </div>
      <div class="col-md col-auto">
        <div v-if="value === undefined || value === ''">
          <q-icon class="text-grey" size="xs" name="mdi-circle-off-outline" />
        </div>
        <div v-else-if="type == 'string'">
          <long-string :value="value"></long-string>
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
              <long-string :value="value" />
            </div>
          </div>
        </div>
        <div v-else-if="type == 'gwei'">
          <div class="row">
            <div class="col-auto">
              <q-chip class="q-chip-camino" size="md" icon="img:images/camino-coin-logo.png">
                {{ getDisplayValueForGewi(value) }}
              </q-chip>
            </div>
          </div>
        </div>
        <div v-else-if="type == 'wei'">
          <div class="row">
            <div class="col-auto">
              <q-chip class="q-chip-camino" icon="img:images/camino-coin-logo.png">
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
      <div v-if="(detailsLink || allowCopy) && (value !== undefined &&  value !== '' && parseInt(value) !== 0)"
        :class="$q.screen.gt.sm ? detailsLink ? 'col-md-2 text-right' : 'col-md-1 text-right' : 'col-12 '">
        <q-btn v-if="detailsLink" size="sm" color="primary" outline rounded icon="mdi-open-in-new" :to="detailsLink">&nbsp;Open</q-btn>
        <q-btn class="q-ml-xs" v-if="allowCopy" @click="() => copyToClipBoard(value?.toString())" size="sm" outline
          rounded icon="mdi-content-copy"></q-btn>
      </div>
    </div>
  </q-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { getDisplayValueForGewi, getDisplayValue } from 'src/utils/currency-utils'
import LongString from 'src/components/ui/LongString.vue'
import { copyToClipBoard } from 'src/utils/copy-utils';

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
    allowCopy: { type: Boolean, default: false }
  },
  setup(props) {
    return {
      getStatusIcon,
      getStatusClass,
      getRelativeTime,
      getDisplayValueForGewi,
      getDisplayValue,
      copyToClipBoard
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
