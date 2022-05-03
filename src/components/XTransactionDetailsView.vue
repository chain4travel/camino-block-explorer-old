<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-subtitle1 col-11">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section class="container">
      <q-list bordered separator>
        <q-item>
          <q-item-section class="col-2">
            Id
          </q-item-section>
          <q-item-section class="col-10">
            {{ content.id }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-2">
            Status
          </q-item-section>
          <q-item-section class="col-10">
            <q-icon :class="getStatusClass(content.status)" size="sm" :name="getStatusIcon(content.status)" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-2">
            Type
          </q-item-section>
          <q-item-section class="col-10">
            {{ content.type }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-2">
            Timestamp
          </q-item-section>
          <q-item-section class="col-10">
            {{ content.timestamp }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-2">
            Fee
          </q-item-section>
          <q-item-section class="col-10">
            {{ getDisplayValue(content.fee) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-2">
            Memo
          </q-item-section>
          <q-item-section class="col-10">
            
          </q-item-section>
        </q-item>
        <q-item>
          <div class="col-6 q-pa-sm">
            <!-- m :key="key" v-for="[key, value] in linesToRender" -->
              <q-card>
                <q-card-section v-if="title">
                  <div class="row">
                    <div class="text-subtitle1 col-12">Input</div>
                  </div>
                </q-card-section>
                <q-card-section :key="fund.address" v-for="fund in $props.content.from">
                  <div class="row">
                    <div class="col-9">
                      <div class="row col-9">
                        <div class="col-3">
                          Address
                        </div>
                        <div class="col-9">{{ fund.address }}</div>
                      </div>
                      <div v-if="fund.signature" class="row col-9">
                        <div class="col-3">
                          Signature
                        </div>
                        <LongString class="col-9" :value="fund.signature" />
                      </div>
                    </div>
                    <div class="col-3 text-right">
                      {{ getDisplayValue(fund.value) }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
          </div>
          <div class="col-6 q-pa-sm">
            <!-- m :key="key" v-for="[key, value] in linesToRender" -->
              <q-card>
                <q-card-section v-if="title">
                  <div class="row">
                    <div class="text-subtitle1 col-12">Output</div>
                  </div>
                </q-card-section>
                <q-card-section :key="fund.address" v-for="fund in $props.content.to">
                  <div class="row">
                    <div class="col-9">
                      <div class="row col-9">
                        <div class="col-3">
                          Address
                        </div>
                        <div class="col-9">{{ fund.address }}</div>
                      </div>
                      <div v-if="fund.signature" class="row col-9">
                        <div class="col-3">
                          Signature
                        </div>
                        <LongString class="col-9" :value="fund.signature" />
                      </div>
                    </div>
                    <div class="col-3 text-right">
                      {{ getDisplayValue(fund.value) }}
                    </div>
                  </div>
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
import { useQuasar } from 'quasar'
import { getDisplayValue, currencyFields } from 'src/utils/currency-utils'
import { camelCaseToRegular } from 'src/utils/display-utils'
import { BlockDetails } from 'src/types/block-detail'
import { getBlockDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'
import { XTransaction } from 'src/types/transaction'
import LongString from './ui/LongString.vue'

function getStatusIcon(status: string) {
  if(status === 'accepted') {
    return 'mdi-check-circle-outline';
  } else {
    return 'mdi-help-circle-outline';
  }
}

function getStatusClass(status: string) {
  let css = 'q-ml-sm ';
  if(status === 'accepted') {
    css = css + 'text-green';
  } else {
    css = css + 'text-blue';
  }
  return css
}

export default defineComponent({
    name: 'XTransactionDetailsView',
    props: {
        title: { type: String as PropType<string>, required: false },
        type: { type: String as PropType<ChainType>, required: true },
        backRoute: { type: String as PropType<string>, required: false },
        content: { type: Object as PropType<XTransaction>, required: true }
    },
    setup(props) {
        console.log('Detailed TX', props.content);
        const keyWithRoutes = {
            'blockHash': (value: string) => getBlockDetailsPath(props.type, value),
            'childHash': (value: string) => getBlockDetailsPath(props.type, value)
        };
        const keysTohide = ['additionalInformation'];
        const $q = useQuasar();
        const router = useRouter();
        const showAdditionaldetails = ref(false);
        return {
            getStatusIcon,
            getStatusClass,
            showAdditionaldetails,
            copyToClipBoard: async (value: string) => {
                await navigator.clipboard.writeText(value);
                $q.notify({
                    message: 'Value copied to Clipboard',
                    closeBtn: true,
                    timeout: 500
                });
            },
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
    components: { LongString }
})
</script>

<style scoped lang="sass">
*
  background: #27324C
  color: white
// .hover-effect:hover
//   background-color: yellow

.foreground
  z-index: 1000
</style>
