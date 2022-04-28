<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-subtitle1 col-11">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section class="container">
      <q-list bordered separator>
        <q-item :key="key" v-for="[key, value] in linesToRender" v-ripple clickable
          @click="copyToClipBoard(value)">
          <q-item-section class="col-4">
            {{ camelCaseToRegular(key) }}
          </q-item-section>
          <q-item-section class="col-7">
            <LongString v-if="fieldIncurrencyFields(key)" :value="getDisplayValue(value)">
              <q-icon class="q-ml-sm" size="sm" name="img:camino-coin-logo.png" />
            </LongString>
            <LongString v-else-if="isString(value)" :value="value" :max-length="85">
            </LongString>
            <LongString v-else-if="value" :value="JSON.stringify(value)" :max-length="85"></LongString>
            <div v-else>{{ "" }}</div>
          </q-item-section>
          <q-item-section v-if="keyHasLink(key)" class="col-1">
            <q-btn class="foreground" size="sm" icon="mdi-magnify" color="primary"
              @click.stop="() => handleLinkClick(key, value)">
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item v-if="content.additionalInformation">
          <q-btn class="offset-5" color="primary" @click="() => showAdditionaldetails = !showAdditionaldetails">
            {{ showAdditionaldetails ? "Show Less" : "Show More" }}</q-btn>
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
import LongString from './ui/LongString.vue'
import { useQuasar } from 'quasar'
import { getDisplayValue, currencyFields } from 'src/utils/currency-utils'
import { camelCaseToRegular } from 'src/utils/display-utils'
import { BlockDetails } from 'src/types/block-detail'
import { getBlockDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'



export default defineComponent({
  name: 'DetailsView',
  props: {
    title: { type: String as PropType<string>, required: false },
    type: { type: String as PropType<ChainType>, required: true },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<BlockDetails>, required: true }
  },
  setup(props) {
    console.log('props.type', props.type);
    const keyWithRoutes = {
      'parentHash': (value: string) => getBlockDetailsPath(props.type, value),
      'childHash': (value: string) => getBlockDetailsPath(props.type, value)
    }

    const keysTohide = ['additionalInformation']

    const $q = useQuasar()
    const router = useRouter();
    const showAdditionaldetails = ref(false);
    return {
      showAdditionaldetails,
      linesToRender: computed(() => {
        const dataToShow = Object.entries(props.content);
        if(showAdditionaldetails.value && props.content.additionalInformation) {
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
        if (keyWithRoutes[key] && value) {
          const route = keyWithRoutes[key](value)
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
