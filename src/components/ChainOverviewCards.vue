<template>
  <div>
    <div
      :class="
        'row  q-pa-sm q-pb-md ' +
        ($q.screen.gt.sm
          ? 'justify-end text-right'
          : 'justify-center text-center')
      "
    >
      <div class="col-12">
        <div class="q-gutter-sm">
          <q-radio
            dense
            @update:model-value="updateFields"
            v-for="option in timeOptions"
            v-model="mStore.selectedTime"
            :val="option.value"
            :label="option.label"
            :key="option.label"
            :color="$q.dark.isActive ? 'white' : 'primary'"
          />
        </div>
        <!-- <q-select dense @update:model-value="updateFields" v-model="selectedTime" :options="timeOptions" emit-value
          map-options label="Timeframe">
        </q-select> -->
      </div>
    </div>
    <div class="row q-pb-md" style="gap: 10px">
      <div class="col-md col-12">
        <router-link class="text-link" :to="redirectAllValidators">
          <DataCard title="Number of Validators" class="text-h4">
            <span v-if="!validatorsLoading">
              {{
                mStore.numberOfValidators
                  ? mStore.numberOfValidators.toLocaleString()
                  : '-'
              }}
            </span>
            <q-spinner v-else color="primary" />
            <span
              class="grey-color q-pl-sm text-h6"
              v-if="!validatorsLoading && mStore.numberOfActiveValidators"
            >
              ({{ mStore.numberOfActiveValidators }} /
              {{ mStore.percentageOfActiveValidators }}% active)
            </span>
          </DataCard>
        </router-link>
      </div>
      <div class="col-md col-12">
        <DataCard title="Number of Transactions " class="text-h4">
          <span v-if="!mStore.transactionsLoading">{{
            mStore.numberOfTransactions.toLocaleString()
          }}</span>
          <q-spinner v-else color="primary" />
        </DataCard>
      </div>
      <div class="col-md col-12">
        <DataCard title="Total Gas Fees" class="text-h4">
          <span v-if="!mStore.gasFeesLoading">{{
            getDisplayValueForGewi(mStore.totalGasFees)
          }}</span>
          <q-spinner v-else color="primary" />
        </DataCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import DataCard from 'src/components/ui/DataCard.vue';
import {
  getDisplayValueForGewi,
  getDisplayValue,
} from 'src/utils/currency-utils';
import { ChainOverviewLoader, Timeframe } from 'src/types/chain-loader';
import { getAllValidatorsPath } from 'src/utils/route-utils';
import { useMagellanTxStore } from 'src/stores/magellan-tx-store';
import { timeOptions } from 'src/utils/date-utils';

const mStore = useMagellanTxStore();

export default defineComponent({
  name: 'ChainOverviewCards',
  props: {
    store: { type: Object as PropType<ChainOverviewLoader> },
    priceInWei: { type: Boolean, default: false },
  },
  async setup(props) {
    // const transactionsLoading = ref(false);
    const validatorsLoading = ref(false);
    // const gasFeesLoading = ref(false);
    mStore.validators = await props.store?.getNumberOfValidators();
    mStore.numberOfValidators = mStore.validators.numberOfValidators;
    mStore.numberOfActiveValidators =
      mStore.validators.numberOfActiveValidators;
    mStore.percentageOfActiveValidators = (
      (mStore.numberOfActiveValidators / mStore.numberOfValidators) *
      100
    ).toFixed(0);

    async function updateFields(value: Timeframe) {
      mStore.selectedTime = value;
      mStore.gasFeesLoading = true;
      mStore.transactionsLoading = true;
      // gasFeesLoading.value = true;
      // transactionsLoading.value = true;
      const [transactionAggregate, gasFeeAggregate] = await Promise.all([
        props.store?.loadNumberOfTransactions(value),
        props.store?.loadTotalGasFess(value),
      ]);
      mStore.numberOfTransactions = transactionAggregate || 0;
      mStore.totalGasFees = gasFeeAggregate || 0;
      // gasFeesLoading.value = false;
      // transactionsLoading.value = false;
      mStore.gasFeesLoading = false;
      mStore.transactionsLoading = false;
    }

    updateFields(mStore.selectedTime);

    return {
      redirectAllValidators: getAllValidatorsPath(),
      // transactionsLoading,
      validatorsLoading,
      // gasFeesLoading,
      timeOptions,
      getDisplayValue,
      getDisplayValueForGewi,
      updateFields,
      mStore,
    };
  },
  components: { DataCard },
});
</script>
