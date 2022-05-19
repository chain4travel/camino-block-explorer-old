<template>
  <div v-if="address">
    <div class="row q-pa-md">
      <q-icon class="col-auto grey-color q-pt-xs" size="sm" name="mdi-file-document"></q-icon>
      <div class="col-auto text-bold text-h6 q-pl-md"> Address <span class="grey-color">{{ address
      }}</span></div>
      <q-btn class="col-auto q-ml-xs" @click="() => copyToClipBoard(address)" size="sm" rounded icon="mdi-content-copy">
      </q-btn>
    </div>
    <div class="row q-gutter-md">
      <div class="col">
        <q-card>
          <q-card-section>
            <q-card-section class="text-bold">
              Balances
            </q-card-section>
            <div v-for="balance in balances" :key="balance.id">
              <detail-field v-if="balance.symbol === 'CAM'" type="gwei" :field="balance.name" :value="balance.balance">
              </detail-field>
              <detail-field v-else type="currency" :field="balance.name"
                :value="{ value: balance.balance, currency: balance.symbol }"></detail-field>
            </div>
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
              <!-- Discuss if needed (would look like table headers)-->
              <!-- <div class="gt-md row">
                <div class="col-md-2">ID</div>
                <div class="col-md-1">Chain</div>
                <div class="col-md-1">Type</div>
                <div class="col-md-4">From</div>
                <div class="col-md-4">To</div>
              </div>
              <q-separator class="gt-sm" /> -->
              <q-card>
                <q-card-section>
                  <div v-for="tx in txData" :key="tx.id">
                    <div class="row items-center">
                      <div class="col-md-2 col-12">
                        <AddressLink class="monospace" :to="getDetailsRoute(tx.id)" :value="tx.id" :xsLength="40"
                          :smLength="64" :mdLength="15" :lgLength="20" :xlLength="30"></AddressLink>
                        <p v-if="tx.timestamp">{{ getRelativeTime(tx.timestamp) + " ago" }}</p>
                      </div>
                      <div class="col-md-1 col-12">
                        <q-avatar :class="'text-' + avatar + '-avatar'" :color="avatar + '-avatar'">{{
                            avatar.toUpperCase()
                        }}</q-avatar>
                      </div>
                      <div class="col-md-1 col-12">
                        <q-chip>{{ tx.type }}</q-chip>
                      </div>
                      <div class="col-md-4 col-12">
                        <FundCard class="col-md col-12" type="From" title="Input" :funds="tx.from"
                          :breakPoints="[30, 20, 12, 20, 35]">
                        </FundCard>
                      </div>
                      <!-- <q-separator class="lt-md" /> -->
                      <div class="col-md-4 col-12">
                        <FundCard class="col-md-3 col-12" type="To" title="Output" :funds="tx.to"
                          :breakPoints="[30, 20, 12, 20, 35]">
                        </FundCard>
                      </div>
                    </div>
                    <q-separator />
                  </div>
                  <q-card-actions v-if="couldBeMoreElements" class="justify-center">
                    <q-btn outline rounded  @click="loadNextPage"  color="primary" class="col-6">
                      Load More
                    </q-btn>
                  </q-card-actions>
                </q-card-section>
              </q-card>

              <q-separator />
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
import { defineComponent, ref, Ref, PropType } from 'vue'
import { copyToClipBoard } from 'src/utils/copy-utils';
import { useRoute } from 'vue-router';
import ErrorNotFoundPage from 'src/pages/ErrorNotFoundPage.vue';
import { useAddressStore } from 'src/stores/address-store';
import { ChainType } from 'src/types/chain-type';
import DetailField from './ui/DetailField.vue';
import { XPTransaction } from 'src/types/transaction';
import { getStringOrFirstElement, getRelativeTime } from 'src/utils/display-utils';
import { getTransactionDetailsPath } from 'src/utils/route-utils';
import { getAlias } from 'src/types/chain-type';
import FundCard from './ui/FundCard.vue';
import AddressLink from './ui/AddressLink.vue';

const tabs =
  [{
    key: 'transactions',
    label: 'Transactions'
  }]

const pageSize = 10;

export default defineComponent({
  name: 'AddressDetails',
  props:
  {
    chainType: { type: String as PropType<ChainType>, required: true }
  },

  async setup(props) {
    const route = useRoute();
    const addressStore = useAddressStore();
    const address = ref(getStringOrFirstElement(route.params.addressId));
    const allTxData: Ref<XPTransaction[]> = ref(await addressStore.loadXpTransactions(address.value, getAlias(props.chainType), 0, pageSize))
    let couldBeMoreElements: Ref<boolean> = ref(allTxData.value.length >= pageSize);
    let currentOffset = allTxData.value.length;
    const balances = ref(await addressStore.loadBalances(address.value))
    return {
      couldBeMoreElements,
      getRelativeTime,
      getTransactionDetailsPath,
      copyToClipBoard,
      tab: ref('transactions'),
      tabs,
      address,
      requireLoadMore() {
        return false;
      },
      getDetailsRoute(txnHash: string) {
        return `${getTransactionDetailsPath(props.chainType, txnHash)}?back=${route.fullPath}`;
      },
      loadNextPage: async () => {
        const nextPage = await addressStore.loadXpTransactions(address.value, getAlias(props.chainType), currentOffset, pageSize);
        allTxData.value.push(...nextPage)
        currentOffset += nextPage.length;
        couldBeMoreElements.value = nextPage.length >= pageSize;
      },
      txData: allTxData,
      avatar: getAlias(props.chainType),
      balances
    };
  },
  components: { ErrorNotFoundPage, DetailField, FundCard, AddressLink }
})
</script>
