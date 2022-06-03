<template>
  <q-item class="table-item">
    <div class="row m-auto--md elements">
      <div :class="getTitleClass($q.screen.gt.xs, detailsLink, allowCopy, value)">
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
      <div :class="getContentClass($q.screen.gt.xs)">
        <div v-if="value === undefined || value === ''">
          <q-icon class="text-grey" size="xs" name="mdi-circle-off-outline" />
        </div>
        <div v-else-if="type == 'string'">
          <long-string :value="value" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength"></long-string>
        </div>
          <div v-else-if="type == 'number'">
          <long-string :value="value.toLocaleString()" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength"></long-string>
        </div>
        <div v-else-if="type == 'monospace'">
          <long-string class="monospace" :value="value" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength"></long-string>
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
              <LongString :value="value" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength" />
            </div>
          </div>
        </div>
        <div v-else-if="type == 'gwei'">
          <div class="row">
            <div class="col-auto">
              <CamAmount :value="nCamToACam(Number(value))" />
            </div>
          </div>
        </div>
        <div v-else-if="type == 'wei'">
          <div class="row">
            <div class="col-auto">
              <CamAmount :value="Number(value)" />
            </div>
          </div>
        </div>
        <div v-else-if="type == 'ctxtype'">
          <div class="row">
            <div class="col-auto">
              <q-chip size="md">{{ value == 0 ? 'Legacy' : 'EIP1559' }}</q-chip>
            </div>
          </div>
        </div>
        <div v-else-if="type == 'hexdata'">
          <q-icon v-if="parseInt(value) === 0" class="q-ml-sm text-grey" size="xs" name="mdi-circle-off-outline" />
          <LongString class="monospace" v-else :value="value" :xl-length="xlLength" :lg-length="lgLength" :md-length="mdLength" :sm-length="smLength" :xs-length="xsLength" />
        </div>
      </div>
      <div v-if="(detailsLink || allowCopy) && (value !== undefined && value !== '' && parseInt(value) !== 0)"
        :class="$q.screen.gt.xs ? detailsLink ? 'col-md-3 col-4 text-right m-auto--md q-gutter-y-xs' : 'col-md-2 col text-right m-auto' : 'col-6 q-gutter-y-xs m-auto item-buttons'">
        <q-btn v-if="detailsLink" size="sm" color="primary" outline rounded icon="mdi-open-in-new" :to="detailsLink">
          &nbsp;Open</q-btn>
        <CopyButton v-if="allowCopy && value" :value="value.toString()"/>
      </div>
    </div>
  </q-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getRelativeTime } from 'src/utils/display-utils'
import { formatAmount, nCamToACam } from 'src/utils/currency-utils'
import LongString from 'src/components/ui/LongString.vue'
import CamAmount from 'src/components/ui/CamAmount.vue'
import CopyButton from 'src/components/ui/CopyButton.vue';

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

function getTitleClass(size: boolean| undefined, detailsLink: string | undefined, allowCopy: boolean, value: number | string) {
  if (!size) {
    if ((detailsLink || allowCopy) && (value !== undefined && value !== '' && parseInt(value) !== 0)) {
      return 'col-md-4 col-6 text-bold flex m-auto--md item-title'
    } else {
      return 'col-md-4 col-12 text-bold flex m-auto--md item-title'
    }
  }
  else
    return 'col-md-4 col-12 text-bold flex m-auto--md'
}

function getContentClass(size: boolean| undefined) {
  if (!size) 
    return 'col-md col-12 q-mt-xs flex items-center item-content'
  else
    return 'col-md col-8 flex items-center'
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
  'Transaction Cost': "The cost of the transaction, calculated using ('Effective Gas Price' * 'Gas Limit')",
  //C-BLOCKS
  'Number': 'The block number',
  'Parent Hash': 'The Hash of the parent block',
  'Base Gas Fee': 'The minimum gas fee required for a transaction to be included in a block',
  'Fees': "The total transaction fees for this block. This is calculated by adding up all the transaction costs.",
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
    smLength: {type: Number, required: false, default: 40},
    mdLength: {type: Number, required: false, default: 27},
    lgLength: {type: Number, required: false, default: 45},
    xlLength: {type: Number, required: false, default: 75}
  },
  setup() {
    return {
      getStatusIcon,
      getStatusClass,
      getRelativeTime,
      nCamToACam,
      formatAmount,
      getTitleClass,
      getContentClass,
      getTooltip: (field: string): string | undefined => {
        if (Object.keys(tooltips).includes(field)) {
          return tooltips[field];
        }
        return undefined;
      }
    }
  },
  components: { LongString, CopyButton, CamAmount }
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
