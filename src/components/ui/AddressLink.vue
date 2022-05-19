<template>
  <router-link class="text-link" :to="to">
    <LongString :showTooltip="!$q.platform.is.mobile" :value="value" :xl-length="xlLength || 55" :lg-length="lgLength || 55" :md-length="mdLength || 40" :sm-length="smLength || 50" :xs-length="xsLength || 20" />
  </router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LongString from 'src/components/ui/LongString.vue'
export default defineComponent({
  name: 'AddressLink',
  props: {
    to: { type: String, required: true },
    value: { type: String, required: true },
    xsLength: { type: Number, required: false },
    smLength: { type: Number, required: false },
    mdLength: { type: Number, required: false },
    lgLength: { type: Number, required: false },
    xlLength: { type: Number, required: false }
  },
  components: { LongString }
})
</script>
