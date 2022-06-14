<template>
  <div>
    <div :class="'row  q-pa-sm ' +  ($q.screen.gt.sm ? 'justify-end text-right' : 'justify-center text-center')">
      <div class="col-12">
        <div class="q-gutter-sm">
          <q-radio dense @update:model-value="updateFields" v-for="option in timeOptions" v-model="selectedTime" :val="option.value" :label="option.label" :key="option.label" />
        </div>
        <!-- <q-select dense @update:model-value="updateFields" v-model="selectedTime" :options="timeOptions" emit-value
          map-options label="Timeframe">
        </q-select> -->
      </div>
    </div>
    <div class="row q-gutter-sm q-pb-md">
      <div class="col-md col-12">
        <DataCard title="Number of Validators" class="text-h4">
          <span v-if="!validatorsLoading">
            {{ numberOfValidators ? numberOfValidators.toLocaleString() : '-'}}
          </span>
          <q-spinner v-else color="primary" />
          <span class="grey-color q-pl-sm text-h6" v-if="!validatorsLoading && numberOfActiveValidators > 0">
            ({{ numberOfActiveValidators }} / {{ percentageOfActiveValidators }}% active)
          </span>
        </DataCard>
      </div>
      <div class="col-md col-12">
        <DataCard title="Number of Transactions " class="text-h4">
          <span v-if="!transactionsLoading">{{
              numberOfTransactions.toLocaleString()
          }}</span>
          <q-spinner v-else color="primary" />
        </DataCard>
      </div>
      <div class="col-md col-12">
        <DataCard title="Total Gas Fees" class="text-h4">
          <span v-if="!gasFeesLoading">{{
              priceInWei ? getDisplayValue(totalGasFees) : getDisplayValueForGewi(totalGasFees)
          }}</span>
          <q-spinner v-else color="primary" />
        </DataCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, Ref } from 'vue';
import DataCard from 'src/components/ui/DataCard.vue'
import { getDisplayValueForGewi, getDisplayValue } from 'src/utils/currency-utils';
import { ChainOverviewLoader, getLabel, Timeframe } from 'src/types/chain-loader';

export default defineComponent({
  name: 'ChainOverviewCards',
  props: {
    store: { type: Object as PropType<ChainOverviewLoader> },
    priceInWei: { type: Boolean, default: false }
  },
  async setup(props) {

    const timeOptions = ref([{ value: Timeframe.HOURS_24, label: getLabel(Timeframe.HOURS_24) }, { value: Timeframe.DAYS_7, label: getLabel(Timeframe.DAYS_7) }, { value: Timeframe.MONTHS_1, label: getLabel(Timeframe.MONTHS_1) }])
    const selectedTime: Ref<Timeframe> = ref(Timeframe.HOURS_24);

    const validators = ref(await props.store?.getNumberOfValidators());
    const numberOfActiveValidators = ref(validators?.value?.numberOfActiveValidators);
    const numberOfValidators = ref(validators?.value?.numberOfValidators);
    const numberOfTransactions = ref(100)
    const totalGasFees = ref(100000000000)
    const transactionsLoading = ref(false);
    const validatorsLoading = ref(false);
    const gasFeesLoading = ref(false);
    const percentageOfActiveValidators = ref(((numberOfActiveValidators.value / numberOfValidators.value) * 100).toFixed(0));

    async function updateFields(value: Timeframe) {
      gasFeesLoading.value = true;
      transactionsLoading.value = true;
      const [transactionAggregate, gasFeeAggregate] = await Promise.all([props.store?.loadNumberOfTransactions(value), props.store?.loadTotalGasFess(value)])
      numberOfTransactions.value = transactionAggregate || 0;
      totalGasFees.value = gasFeeAggregate || 0;
      gasFeesLoading.value = false;
      transactionsLoading.value = false;
    }

    updateFields(selectedTime.value)

    return {
      transactionsLoading,
      validatorsLoading,
      gasFeesLoading,
      numberOfValidators,
      numberOfActiveValidators,
      percentageOfActiveValidators,
      numberOfTransactions,
      totalGasFees,
      timeOptions,
      selectedTime,
      getDisplayValue,
      getDisplayValueForGewi,
      updateFields
    }
  },
  components: { DataCard }
})
</script>
