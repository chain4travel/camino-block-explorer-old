TranscationDetail<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-subtitle1 col-11">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section class="container">
      <q-list>
        <detail-field field="Hash" :value="content.hash" type="string" />
        <detail-field field="Type" :value="content.type" type="ctxtype" />
        <detail-field field="Block" :value="content.block" type="string" />
        <detail-field field="Date" :value="content.createdAt" type="timestamp" />
        <detail-field field="Nonce" :value="content.nonce" type="string" />
        <detail-field field="Gas Price" :value="content.gasPrice" type="wei" />
        <detail-field field="Max fee per gas" :value="content.maxFeePerGas" type="wei" />
        <detail-field field="Max Priority fee per gas" :value="content.maxPriorityFeePerGas" type="wei" />
        <detail-field field="Gas Limit" :value="content.gasLimit" type="wei" />
        <detail-field field="Value" :value="content.value" type="wei" />
        <detail-field field="From" :value="content.fromAddr" type="string" />
        <detail-field field="To" :value="content.toAddr" type="string" />
        <detail-field field="v" :value="content.v" type="string" />
        <detail-field field="r" :value="content.r" type="string" />
        <detail-field field="s" :value="content.s" type="string" />
        <detail-field field="Gas Used" :value="parseInt(content.gasUsed)" type="wei" />
        <detail-field field="Contract Address" :value="content.contractAddress" type="hexdata"></detail-field>
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn rounded outline color="primary" :to="backRoute" icon="mdi-chevron-left"/>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { useQuasar } from 'quasar'
import { getDisplayValue, currencyFields } from 'src/utils/currency-utils'
import { camelCaseToRegular } from 'src/utils/display-utils'
import { getBlockDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'
import DetailField from 'src/components/ui/DetailField.vue'
import { TranscationDetail } from 'src/types/transaction-detail'



export default defineComponent({
  name: 'DetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<TranscationDetail>, required: true },
    magellan: { type: Boolean, default: false }
  },
  setup(props) {

    const keyWithRoutes = {
      'blockNumber': (value: string) => getBlockDetailsPath(props.type, value),
    }

    const keysTohide = ['additionalInformation']

    const $q = useQuasar()
    const router = useRouter();
    const showAdditionaldetails = ref(false);
    return {
      showAdditionaldetails,
      linesToRender: computed(() => {
        const dataToShow = Object.entries(props.content);
        if (showAdditionaldetails.value && props.content.additionalInformation) {
          dataToShow.push(...Object.entries(props.content.additionalInformation));
        }
        return dataToShow.filter(([key]) => !keysTohide.includes(key));
      }),
      copyToClipBoard: async (value: string) => {
        await navigator.clipboard.writeText(value);
        $q.notify({
          message: 'Value copied to Clipboard',
          closeBtn: true,
          timeout: 500
        })
      },
      getDisplayValue,
      fieldIncurrencyFields(key: string) {
        return currencyFields.includes(key);
      },
      isString(val: any) {
        return typeof val === 'string' || val instanceof String
      },
      camelCaseToRegular,
      keyHasLink(key: string) {
        return !!keyWithRoutes[key]
      },
      handleLinkClick(key: string, value: string) {
        if (keyWithRoutes[key] && value !== undefined) {
          const route = keyWithRoutes[key](value)
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
