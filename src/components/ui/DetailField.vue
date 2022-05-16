<template>
  <q-item>
    <div class="row q-gutter-sm">
      <div class="col-md-4 col-12 text-bold">
        <div class="row">
          <q-icon class="col-2 gt-sm grey-color" v-if="icon" size="xs" :name="icon">
            <q-tooltip v-if="tooltip || getTooltip(field)">
              {{ tooltip || getTooltip(field) }}
            </q-tooltip>
          </q-icon>
          <span :class="'col overflow-handle ' + ($q.screen.lt.md ? '' : 'q-pl-md')">
            {{ field }}
          </span>
        </div>
      </div>
      <div class="col-md col">
        <div v-if="value === undefined || value === ''">
          <q-icon class="text-grey" size="xs" name="mdi-circle-off-outline" />
        </div>
        <div v-else-if="type == 'string'">
          <long-string :value="value" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength"></long-string>
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
              <long-string :value="value" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength" />
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
          <long-string class="monospace" v-else :value="value" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength" />
        </div>
      </div>
      <div v-if="(detailsLink || allowCopy) && (value !== undefined && value !== '' && parseInt(value) !== 0)"
        :class="$q.screen.gt.sm ? detailsLink ? 'col-md-2 text-right' : 'col-md-1 text-right' : 'col-2'">
        <q-btn v-if="detailsLink" size="sm" color="primary" outline rounded icon="mdi-open-in-new" :to="detailsLink">
          &nbsp;Open</q-btn>
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

const tooltips: { [key: string]: string } = {
  // Contracts
  'Type': 'Defines a transaction type that is an envelope for current and future transaction types',
  'Block': 'The number of the block in which the transaction was recorded',
  'Date': 'The date and time at which a transaction is validated',
  'Gas Price': 'Cost per unit of gas specified for the transaction, in Cam and nCam (nano cam) and aCam (atto cam). The higher the gas price the higher chance of getting included in a block',
  'Max fee per gas': 'The maximum fee per gas that the transaction is willing to pay in total',
  'Max Priority fee per gas': 'The maximum fee per gas to give miners to incentivize them to include the transaction (Priority fee)',
  'Gas Limit': 'The maximum gas allowed in this transaction',
  'Value': 'The value being transacted',
  'From': 'The sending party of the transaction',
  'To': 'The receiving party of the transaction',
  'Gas Used': 'The  gas used in this transaction',
  'Contract Address': 'The address of the contract that was created',
  //C-BLOCKS
  'Number': 'The block number',
  'Parent Hash': 'The Hash of the parent block',
  'Base Gas Fee': 'The minimum gas fee required for a transaction to be included in a block',
  'Fees': 'The fees used by the block',
  'Timestamp': 'The date and time at which a transaction is validated',
  'Transaction Count': 'The amount of transactions in this block',
  'Extra Data': 'Additional data in this block',
  //C-BLOCKS
  'Status': 'The transaction status',
  'Fee': 'The fee of the transaction',
  'Memo': 'The memo that was added to the transaction',
  'Signature': 'The signature of the input'
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
    allowCopy: { type: Boolean, default: false },
    xsLength: {type: Number, required: false, default: 20},
    smLength: {type: Number, required: false, default: 50},
    mdLength: {type: Number, required: false, default: 40},
    lgLength: {type: Number, required: false, default: 55},
    xlLength: {type: Number, required: false, default: 75}
  },
  setup() {
    return {
      getStatusIcon,
      getStatusClass,
      getRelativeTime,
      getDisplayValueForGewi,
      getDisplayValue,
      copyToClipBoard,
      getTooltip: (field: string): string | undefined => {
        if (Object.keys(tooltips).includes(field)) {
          return tooltips[field];
        }
        return undefined;
      }
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
