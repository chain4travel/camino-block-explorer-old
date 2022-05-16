<template>
  <router-link class="text-link" :to="getAddressDetailsPath(value)">
    <long-string :value="value" :xs-length="xsLength" :sm-length="smLength" :md-length="mdLength" :lg-length="lgLength"
      :xl-length="xlLength" />
  </router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getAddressDetailsPath } from 'src/utils/route-utils'
import LongString from 'src/components/ui/LongString.vue'
export default defineComponent({
  name: 'AddressLink',
  props: {
    value: { type: String, required: true },
    xsLength: { type: Number, required: true },
    smLength: { type: Number, required: true },
    mdLength: { type: Number, required: true },
    lgLength: { type: Number, required: true },
    xlLength: { type: Number, required: true }
  },
  setup() {
    return {
      getAddressDetailsPath
    }
  },
  components: { LongString }
})
</script>
