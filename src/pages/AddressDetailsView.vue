<template>
  <!-- content -->
  <c-address-details v-if="isCChain"></c-address-details>
  <x-p-address-details v-else-if="chainType" :chain-type="chainType"></x-p-address-details>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from 'vue'
import CAddressDetails from 'src/components/CAddressDetails.vue'
import XPAddressDetails from 'src/components/XPAddressDetails.vue'
import { getStringOrFirstElement } from 'src/utils/display-utils';
import { useRoute } from 'vue-router'
import { ChainType } from 'src/types/chain-type';

export default defineComponent({
  name: 'AddressDetailsView',
  components: { CAddressDetails, XPAddressDetails },
  async setup() {
    const route = useRoute();
    const chainType = computed(() => {
      if (getStringOrFirstElement(route.params.addressId).startsWith('X-')) {
        return ChainType.X_CHAIN;
      } else if (getStringOrFirstElement(route.params.addressId).startsWith('P-')) {
        return ChainType.P_CHAIN;
      } else if (getStringOrFirstElement(route.params.addressId).startsWith('0x')) {
        return ChainType.C_CHAIN
      }
      return false;
    }) as ComputedRef<ChainType | false>
    return {
      chainType,
      isCChain: computed(() => {
        return chainType.value === ChainType.C_CHAIN;
      })
    }
  }
})
</script>
