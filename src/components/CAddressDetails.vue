<template>
  <div v-if="$route.params.addressId">
    <div class="row q-pa-md">
      <q-icon class="col-auto grey-color q-pt-xs" size="sm" name="mdi-file-document"></q-icon>
      <div class="col-auto text-bold text-h6 q-pl-md"> Address <span class="grey-color">{{ $route.params.addressId
      }}</span></div>
      <q-btn class="col-auto q-ml-xs" @click="() => copyToClipBoard($route.params.addressId)" size="sm" rounded
        icon="mdi-content-copy"></q-btn>
    </div>
    <div class="row q-gutter-md">
      <div class="col">
        <q-card>
          <q-card-section>
            <h1>Overview</h1>
          </q-card-section>
        </q-card>
      </div>
      <div class="col">
        <q-card>
          <q-card-section>
            <h1>More Info</h1>
          </q-card-section>
        </q-card>
      </div>

    </div>
    <div class="row q-pt-md justify-center">
      <q-card class="col">
        <q-card-section>
          <div class="row">
            <div class="col-auto">
              <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
                <q-tab v-for="tab of tabs" :key="tab.key" :name="tab.key" :label="tab.label" />
              </q-tabs>
              <q-separator />
            </div>
          </div>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="transactions">
              <details-table :columns="columns" :load-data="loadData" :require-load-more="requireLoadMore">
              </details-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

      </q-card>

    </div>
  </div>
  <div v-else>
    <error-not-found-page></error-not-found-page>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { copyToClipBoard } from 'src/utils/copy-utils';
import DetailsTable from './DetailsTable.vue';
import { useRoute } from 'vue-router';
import ErrorNotFoundPage from 'src/pages/ErrorNotFoundPage.vue';
import { useAddressStore } from 'src/stores/address-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';
import { CAddressTransactionTableData } from 'src/types/transaction'
import { getDisplayValue } from 'src/utils/currency-utils'
import { MagellanTransactionDetail } from 'src/types/magellan-types';

const tabs =
  [{
    key: 'transactions',
    label: 'Transactions'
  }]

const columns = [
  {
    name: 'action',
    label: '',
    field: '',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'txnHash',
    label: 'Txn Hash',
    field: 'txnHash',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'method',
    label: 'Method',
    field: 'method',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'block',
    label: 'Block',
    field: 'block',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'age',
    label: 'Age',
    field: 'age',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'from',
    label: 'From',
    field: 'from',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'to',
    label: 'To',
    field: 'to',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'value',
    label: 'Value',
    field: 'value',
    align: 'left',
    // width: '65' // check!!
  },
  {
    name: 'txnFee',
    label: 'Txn Fee',
    field: 'txnFee',
    align: 'left',
    // width: '65' // check!!
  },
]


function getFee(element: MagellanTransactionDetail): string {
  return getDisplayValue(element.gasPrice * parseInt(element.receipt.gasUsed));
}

export default defineComponent({
  name: 'AddressDetails',
  async setup() {
    const route = useRoute();
    const addressStore = useAddressStore();

    const allTxData: Ref<CAddressTransactionTableData[]> = ref([])
    const hasMore = true;

    const getMethod = async (element: MagellanTransactionDetail): Promise<string> => {
      if (element.input) {
        return addressStore.lookForMethodName(element.input.substring(2, 10));
      }
      return '';
    }

    return {
      copyToClipBoard,
      tab: ref('transactions'),
      tabs,
      columns: columns,
      async loadData() {
        const data = await addressStore.loadAllCTxsForAddress(getStringOrFirstElement(route.params.addressId), 0, 100);
        console.log('Loaded data: ', data);
        const newData: CAddressTransactionTableData[] = [];
        for (const element of data) {
          newData.push({
            type: element.type,
            age: element.createdAt,
            block: element.block,
            from: element.fromAddr,
            to: element.toAddr,
            method: await getMethod(element),
            txnFee: getFee(element),
            txnHash: element.hash,
            value: getDisplayValue(element.value)
          })
        }
        return newData;
      },
      requireLoadMore() {
        return false;
      },
      txMainData: allTxData
    };
  },
  components: { DetailsTable, ErrorNotFoundPage }
})
</script>