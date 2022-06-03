<template>
    <div class="row self-center justify-end amount-box">
        <div class="self-center">{{ getDisplayAmount(value).value.toLocaleString() }}</div>        
        <q-icon size="sm" :right="true" name="img:/images/gas-station-outline.svg"></q-icon>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getDisplayAmount, getACamAmount } from 'src/utils/currency-utils'



export default defineComponent({
  name: 'GasAmount',
  props: {
    value: { type: Number, required: true },
  },
  components: {  },
  setup() { 
    return { getDisplayAmount, getACamAmount};
  }
})
</script>
<style scoped lang="sass" >
.amount-box
  padding-top: 1px
  padding-bottom: 1px
</style>
