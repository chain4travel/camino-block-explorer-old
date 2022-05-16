loadAllCTxsForAddressloadAddresses<template>
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
             <detail-field type="string" field="Balance" value="100000"></detail-field>
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
import { defineComponent, ref, Ref,  PropType } from 'vue'
import { copyToClipBoard } from 'src/utils/copy-utils';
import DetailsTable from './DetailsTable.vue';
// import { useRoute } from 'vue-router';
import ErrorNotFoundPage from 'src/pages/ErrorNotFoundPage.vue';
// import { useAddressStore } from 'src/stores/address-store';
import { ChainType } from 'src/types/chain-type';
import DetailField from './ui/DetailField.vue';

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


export default defineComponent({
  name: 'AddressDetails',
  props:
  {
    chainType: { type: String as PropType<ChainType>, required: true }
  },

  async setup() {
    // const route = useRoute();
    // const addressStore = useAddressStore();

    const allTxData: Ref<[]> = ref([])
    // const hasMore = true;

    return {
      copyToClipBoard,
      tab: ref('transactions'),
      tabs,
      columns: columns,
      async loadData() {
        //const data = await addressStore.loadTransactions(props.chainType, getStringOrFirstElement(route.params.addressId), 0, 100);
        const newData: [] = [];
        // for (const element of data) {
        //   newData.push(element)
        // }
        return newData;
      },
      requireLoadMore() {
        return false;
      },
      txMainData: allTxData
    };
  },
  components: { DetailsTable, ErrorNotFoundPage,  DetailField }
})
</script>
