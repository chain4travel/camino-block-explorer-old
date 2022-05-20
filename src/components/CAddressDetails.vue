<template>
  <div v-if="$route.params.addressId">
    <div class="row q-pa-md">
      <q-icon class="col-auto grey-color q-pt-xs" size="sm" name="mdi-file-document"></q-icon>
      <div class="col-auto text-bold text-h6 q-pl-md"> Address <span class="grey-color">{{ $route.params.addressId
      }}</span></div>
      <CopyButton class="col-auto" :value="$route.params.addressId.toString()" />
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
              <DetailsTable height="57vh" :columns="columns" :load-data="loadData" :require-load-more="requireLoadMore"
                :store="store">
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
              </DetailsTable>
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
import DetailsTable from './DetailsTable.vue';
import { useRoute } from 'vue-router';
import ErrorNotFoundPage from 'src/pages/ErrorNotFoundPage.vue';
import { useAddressStore } from 'src/stores/address-store';
import { getStringOrFirstElement } from 'src/utils/display-utils';
import { CAddressTransactionTableData } from 'src/types/transaction'
import { MagellanTransactionDetail } from 'src/types/magellan-types';
import { getTransactionDetailsPath, getAddressDetailsPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { ChainLoader } from 'src/types/chain-loader';
import CopyButton from 'src/components/ui/CopyButton.vue';

const tabs =
  [{
    key: 'transactions',
    label: 'Transactions'
  }]



function getFee(element: MagellanTransactionDetail): number {
  return parseInt(element.gasPrice) * parseInt(element.receipt.gasUsed);
}

export default defineComponent({
  name: 'CAddressDetails',
  async setup() {
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

    function detailsLink(item: string) {
      return `${getTransactionDetailsPath(ChainType.C_CHAIN, item)}?back=${route.fullPath}`
    }

    return {
      tab: ref('transactions'),
      tabs,
      store: addressStore,

      async loadData(store: ChainLoader, knownHashes: string[], offset: number, limit: number) {
        const data = await store.loadAllCTxsForAddress(getStringOrFirstElement(route.params.addressId), offset, limit);
        const newData: CAddressTransactionTableData[] = [];
        moreToLoad = false;
        for (const element of data) {
          if (!knownHashes.includes(element.hash)) {
            newData.push({
              type: element.type,
              age: new Date(element.createdAt),
              block: element.block,
              from: element.fromAddr,
              to: element.toAddr,
              method: await getMethod(element),
              txnFee: getFee(element),
              txnHash: element.hash,
              value: element.value,
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
      txMainData: allTxData,
      columns: [
        {
          name: 'direction',
          label: 'In/Out',
          field: 'direction',
          align: 'center',
        },
        {
          name: 'txnHash',
          label: 'Txn Hash',
          field: 'txnHash',
          align: 'center',
          type: 'hash',
          detailsLink: detailsLink
        },
        {
          name: 'method',
          label: 'Method',
          field: 'method',
          align: 'center',
        },
        {
          name: 'block',
          label: 'Block',
          field: 'block',
          align: 'center',
        },
        {
          name: 'age',
          label: 'Age',
          field: 'age',
          align: 'center',
          type: 'timestamp'
        },
        {
          name: 'from',
          label: 'From',
          field: 'from',
          align: 'center',
          type: 'hash',
          detailsLink: getAddressDetailsPath
        },
        {
          name: 'to',
          label: 'To',
          field: 'to',
          align: 'center',
          type: 'hash',
          detailsLink: getAddressDetailsPath
        },
        {
          name: 'value',
          label: 'Value',
          field: 'value',
          align: 'center',
          type: 'currency'
        },
        {
          name: 'txnFee',
          label: 'Txn Fee',
          field: 'txnFee',
          align: 'center',
          type: 'currency'
        },
      ]
    };
  },
  components: { DetailsTable, ErrorNotFoundPage, CopyButton }
})
</script>
