<template>
    <div class="row">
        {{ getDisplayAmount(value).value.toLocaleString() }}
        <q-icon size="sm" :left="true" :right="true" :name="getDisplayAmount(value).currencyIcon"></q-icon>
        <div class="currency-symbol">
          {{ getDisplayAmount(value).currency }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getDisplayAmount } from 'src/utils/currency-utils'

export default defineComponent({
  name: 'CamAmount',
  props: {
    value: { type: Number, required: true },
  },
  components: {  },
  setup() { 
    return {getDisplayAmount};
  }
})
</script>
