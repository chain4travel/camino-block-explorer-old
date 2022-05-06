<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <q-btn icon="mdi-chevron-left" class="col-auto" size="sm" rounded outline color="primary" :to="backRoute">
        </q-btn>
        <div class="text-subtitle1 q-pl-md col-11">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section v-if="title">
      <q-list bordered seperator>
        <detail-field class="highlighted q-pt-md" icon="mdi-cube-outline" field="Block" :value="content.hash"
          type="string" />
      </q-list>
    </q-card-section>
    <q-card-section class="container">
      <q-list bordered separator>
        <detail-field icon="mdi-help-circle-outline" field="Number" :value="content.blockNumber" type="string" />
        <detail-field icon="mdi-help-circle-outline" field="Base Gas Fee" :value="content.baseGaseFee" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Child hash" :value="content.childHash" type="string" :details-link="content.childBlockNumber ? getBlockDetailsPath(type, content.childBlockNumber): undefined"  />

        <detail-field icon="mdi-help-circle-outline" field="Fees" :value="content.fees" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Gas Limit" :value="content.gasLimit" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Gas Used" :value="content.gasUsed" type="wei" />
        <detail-field icon="mdi-help-circle-outline" field="Parent Hash" :value="content.parentHash" type="string" :details-link="content.parentBlockNumber ? getBlockDetailsPath(type, content.parentBlockNumber): undefined" />

        <detail-field icon="mdi-help-circle-outline" field="Timestamp" :value="content.timestamp" type="timestamp" />
        <detail-field icon="mdi-help-circle-outline" field="Transaction Count" :value="content.transactionCount"
          type="string" />
        <div v-if="showAdditionaldetails">
          <detail-field icon="mdi-help-circle-outline" field="Difficulty"
            :value="content.additionalInformation.difficulty" type="string" />
          <detail-field icon="mdi-help-circle-outline" field="Extra Data"
            :value="content.additionalInformation.extraData" type="hexdata" />
          <detail-field icon="mdi-help-circle-outline" field="Logs Bloom"
            :value="content.additionalInformation.logsBloom" type="hexdata" />
          <detail-field icon="mdi-help-circle-outline" field="Uncles" :value="content.additionalInformation.uncles"
            type="string" />
          <detail-field icon="mdi-help-circle-outline" field="Nonce" :value="content.additionalInformation.nonce"
            type="string" />
        </div>
        <q-item v-if="content.additionalInformation">
          <q-btn rounded outline class="offset-5" color="primary"
            @click="() => showAdditionaldetails = !showAdditionaldetails">
            {{ showAdditionaldetails ? "Show Less" : "Show More" }}</q-btn>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn class="full-width" rounded outline color="primary" :to="backRoute">Back</q-btn>

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
      getBlockDetailsPath
    };
  },
  components: { DetailField }
})
</script>
