<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-subtitle1 col-11">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section class="container">
      <q-list>
        <DetailField field="Id" :value="content.id" type="string" />
        <DetailField field="Status" :value="content.status" type="txstatus" />
        <DetailField field="Type" :value="content.type" type="txtype" />
        <DetailField field="Timestamp" :value="content.timestamp" type="timestamp" />
        <DetailField field="Fee" :value="content.fee" type="gwei" />
        <DetailField field="Memo" :value="content.memo" type="string" />
        <q-item>
          <div class="col-6 q-pa-sm">
              <q-card class="q-ma-sm" :key="fund.address" v-for="fund in content.from">
                <q-card-section>
                  <div class="row">
                    <div class="text-subtitle1 col-12">Input</div>
                  </div>
                </q-card-section>
                <q-card-section >

                <q-list>
                  <DetailField field="From" :value="fund.address" type="string" />
                  <DetailField field="Signature" :value="fund.signature" type="string" />
                  <DetailField field="Value" :value="fund.value" type="gwei" />
                </q-list>
                </q-card-section>
              </q-card>
          </div>
          <div class="col-6 q-pa-sm">
              <q-card class="q-ma-sm" :key="fund.address" v-for="fund in content.to">
                <q-card-section>
                  <div class="row">
                    <div class="text-subtitle1 col-12">Output</div>
                  </div>
                </q-card-section>
                <q-card-section >

                <q-list>
                  <DetailField field="To" :value="fund.address" type="string" />
                  <DetailField field="Value" :value="fund.value" type="gwei" />
                </q-list>
                </q-card-section>
              </q-card>
          </div>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn color="primary" :to="backRoute">Back</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
// import LongString from './ui/LongString.vue'
import { getDisplayValue, currencyFields } from 'src/utils/currency-utils'
import { camelCaseToRegular } from 'src/utils/display-utils'
import { ChainType } from 'src/types/chain-type'
import { XTransaction } from 'src/types/transaction'
import DetailField from './DetailField.vue'

export default defineComponent({
    name: 'XTransactionDetailsView',
    props: {
        title: { type: String as PropType<string>, required: false },
        type: { type: String as PropType<ChainType>, required: true },
        backRoute: { type: String as PropType<string>, required: false },
        content: { type: Object as PropType<XTransaction>, required: true }
    },
    setup(props) {
      return {
            getDisplayValue,
            fieldIncurrencyFields(key: string) {
                return currencyFields.includes(key);
            },
            isString(val: any) {
                return typeof val === 'string' || val instanceof String;
            },
            camelCaseToRegular,
            keyHasLink(key: string) {
                return !!keyWithRoutes[key];
            },
            handleLinkClick(key: string, value: string) {
                if (keyWithRoutes[key] && value) {
                    const route = keyWithRoutes[key](value);
                    router.push(route);
                    //router.go(0)
                    return;
                }
            },
        };
    },
    components: { DetailField }
})
</script>

<style scoped lang="sass">
*
  background: $background-card
  color: white
// .hover-effect:hover
//   background-color: yellow

.foreground
  z-index: 1000
</style>
