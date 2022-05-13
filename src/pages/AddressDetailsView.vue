<template>
  <!-- content -->
    <address-details></address-details>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddressDetails from 'src/components/AddressDetails.vue'


export default defineComponent({
  name: 'AddressDetailsView',
  components: {  AddressDetails },
  async setup() {

    return {

    }
  }
})
</script>
