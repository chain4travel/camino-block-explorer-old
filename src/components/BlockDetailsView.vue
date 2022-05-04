<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-subtitle1 col-11">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section class="container">
      <q-list>
        <detail-field field="Hash" :value="content.hash" type="string" />
        <detail-field field="Number" :value="content.blockNumber" type="string" />
        <detail-field field="Base Gas Fee" :value="content.baseGaseFee" type="wei" />
        <detail-field field="Child hash" :value="content.childHash" type="string" />
        <detail-field field="Child block number" :value="content.childBlockNumber" type="string" />
        <detail-field field="Fees" :value="content.fees" type="wei" />
        <detail-field field="Gas Limit" :value="content.gasLimit" type="wei" />
        <detail-field field="Gas Used" :value="content.gasUsed" type="wei" />
        <detail-field field="Parent Hash" :value="content.parentHash" type="string" />
        <detail-field field="Parent Number" :value="content.parentBlockNumber" type="string" />
        <detail-field field="Timestamp" :value="content.timestamp" type="timestamp" />
        <detail-field field="Transaction Count" :value="content.transactionCount" type="string" />
        <div v-if="showAdditionaldetails">
          <detail-field field="Difficulty" :value="content.additionalInformation.difficulty" type="string" />
          <detail-field field="Extra Data" :value="content.additionalInformation.extraData" type="hexdata" />
          <detail-field field="Logs Bloom" :value="content.additionalInformation.logsBloom" type="hexdata" />
          <detail-field field="Uncles" :value="content.additionalInformation.uncles" type="string" />
          <detail-field field="Nonce" :value="content.additionalInformation.nonce" type="string" />
        </div>

        <q-item v-if="content.additionalInformation">
          <q-btn rounded outline class="offset-5" color="primary"
            @click="() => showAdditionaldetails = !showAdditionaldetails">
            {{ showAdditionaldetails ? "Show Less" : "Show More" }}</q-btn>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn rounded outline color="primary" icon="mdi-chevron-left" :to="backRoute"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { useQuasar } from 'quasar'
import { getDisplayValue, currencyFields } from 'src/utils/currency-utils'
import { camelCaseToRegular } from 'src/utils/display-utils'
import { BlockDetails } from 'src/types/block-detail'
import { getBlockDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'
import DetailField from 'src/components/ui/DetailField.vue'



export default defineComponent({
  name: 'DetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<BlockDetails>, required: true }
  },
  setup(props) {
    const keyWithRoutes = {
      'parentBlockNumber': (value: number) => getBlockDetailsPath(props.type, value),
      'childBlockNumber': (value: number) => getBlockDetailsPath(props.type, value)
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
        console.log('Link clicked ', key, value)
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
