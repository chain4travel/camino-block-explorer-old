<template>
  <div>
    <div class="row justify-end q-pa-sm">
      <div class="col-2">
        <q-select dense @update:model-value="updateFields" v-model="selectedTime" :options="timeOptions" emit-value
          map-options label="Timeframe">
        </q-select>
      </div>
    </div>
    <div class="row q-gutter-sm q-pb-md">
      <div class="col">
        <DataCard title="Number of Validators" class="text-h3">
          <span v-if="!validatorsLoading">{{ numberOfValidators ? numberOfValidators.toLocaleString() : 'UNKNOWN'
          }}</span>
          <q-spinner v-else color="primary" />
        </DataCard>
      </div>
      <div class="col">
        <DataCard title="Number of Transactions " class="text-h3">
          <span v-if="!transactionsLoading">{{
              numberOfTransactions.toLocaleString()
          }}</span>
          <q-spinner v-else color="primary" />
        </DataCard>
      </div>
      <div class="col">
        <DataCard title="Total Gas Fees" class="text-h3">
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
import { ChainOverviewLoader, getLabel, Timeframe } from 'src/types/chain-view-loader';

export default defineComponent({
  name: 'ChainOverviewCards',
  props: {
    store: { type: Object as PropType<ChainOverviewLoader> },
    priceInWei: { type: Boolean, default: false }
  },
  async setup(props) {

    const timeOptions = ref([{ value: Timeframe.HOURS_24, label: getLabel(Timeframe.HOURS_24) }, { value: Timeframe.DAYS_7, label: getLabel(Timeframe.DAYS_7) }, { value: Timeframe.MONTHS_1, label: getLabel(Timeframe.MONTHS_1) }])
    const selectedTime: Ref<Timeframe> = ref(Timeframe.HOURS_24);

    const numberOfValidators = ref(await props.store?.getNumberOfValidators());
    const numberOfTransactions = ref(100)
    const totalGasFees = ref(100000000000)
    const transactionsLoading = ref(false);
    const validatorsLoading = ref(false);
    const gasFeesLoading = ref(false);

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
