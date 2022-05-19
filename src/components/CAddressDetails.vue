<template>
  <div v-if="$route.params.addressId">
    <div class="row q-pa-md">
      <q-icon class="col-auto grey-color q-pt-xs" size="sm" name="mdi-file-document"></q-icon>
      <div class="col-auto text-bold text-h6 q-pl-md"> Address <span class="grey-color">{{ $route.params.addressId
      }}</span></div>
      <q-btn class="col-auto q-ml-xs" @click="() => copyToClipBoard($route.params.addressId)" size="sm" rounded
        icon="mdi-content-copy"></q-btn>
    </div>
    <!-- TODO Add once overview data available in magellan-->
    <!-- <div class="row q-gutter-md">
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
    </div> -->
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
              <details-table @row-clicked="(item) => handleRowEvent(item)" :columns="columns" :load-data="loadData"
                :require-load-more="requireLoadMore" :store="store">
                <template v-slot:body-cell-direction="props">
                  <q-td :props="props">
                    <div>
                      <q-badge :color="props.value === 'in' ? 'primary' : 'secondary'" :label="props.value" />
                    </div>
                    <div class="my-table-details">
                      {{ props.row.details }}
                    </div>
                  </q-td>
                </template>
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
import { useRoute, useRouter } from 'vue-router';
import ErrorNotFoundPage from 'src/pages/ErrorNotFoundPage.vue';
import { useAddressStore } from 'src/stores/address-store';
import { getRelativeTime, getStringOrFirstElement } from 'src/utils/display-utils';
import { CAddressTransactionTableData } from 'src/types/transaction'
import { getDisplayValue } from 'src/utils/currency-utils'
import { MagellanTransactionDetail } from 'src/types/magellan-types';
import { getTransactionDetailsPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { ChainLoader } from 'src/types/chain-loader';

const tabs =
  [{
    key: 'transactions',
    label: 'Transactions'
  }]

const columns = [
  {
    name: 'direction',
    label: '',
    field: 'direction',
    align: 'left',
    width: '65' // check!!
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
    field: (row: CAddressTransactionTableData) => getRelativeTime(row.age) + ' ago',
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
    const router = useRouter();
    const route = useRoute();
    const addressStore = useAddressStore();
    const address = getStringOrFirstElement(route.params.addressId)

    const allTxData: Ref<CAddressTransactionTableData[]> = ref([])
    let moreToLoad = true;

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
      store: addressStore,
      handleRowEvent(item: CAddressTransactionTableData) {
        router.push({ path: getTransactionDetailsPath(ChainType.C_CHAIN, item.txnHash), query: { back: route.fullPath } });
      },
      async loadData(store: ChainViewLoader, knownHashes: string[], offset: number, limit: number) {
        const data = await store.loadAllCTxsForAddress(getStringOrFirstElement(route.params.addressId), offset, limit);
        const newData: CAddressTransactionTableData[] = [];
        moreToLoad = false;
        for (const element of data) {
          if (!knownHashes.includes(element.hash)) {
            newData.push({
              type: element.type,
              age: element.createdAt,
              block: element.block,
              from: element.fromAddr,
              to: element.toAddr,
              method: await getMethod(element),
              txnFee: getFee(element),
              txnHash: element.hash,
              value: getDisplayValue(element.value),
              direction: element.fromAddr === address ? 'out' : 'in'
            })
            moreToLoad = true;
            knownHashes.push(element.hash);
          }

        }
        return newData;
      },
      requireLoadMore(): boolean {
        return moreToLoad;
      },
      txMainData: allTxData
    };
  },
  components: { DetailsTable, ErrorNotFoundPage }
})
</script>
