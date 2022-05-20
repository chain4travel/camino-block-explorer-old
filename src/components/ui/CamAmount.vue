<template>
    <div class="row self-center justify-end amount-box">
        <div class="self-center">{{ getDisplayAmount(getACamAmount(value, currency)).value.toLocaleString() }}</div>        
        <q-icon size="sm" :left="true" :right="true" :name="getDisplayAmount(getACamAmount(value, currency)).currencyIcon"></q-icon>
        <div class="currency-symbol self-center">
          {{ getDisplayAmount(getACamAmount(value, currency)).currency }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getDisplayAmount, getACamAmount } from 'src/utils/currency-utils'



export default defineComponent({
  name: 'CamAmount',
  props: {
    value: { type: Number, required: true },
    currency: {type: String, default: 'aCam'}
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
