<template>
  <div>
    <q-input id="input" dense class="search-input" bg-color="search-banner-input" rounded
      label="Search by Address / Hash / Block" outlined v-model="searchInput" clearable @update:model-value="search">
      <template v-slot:append>
        <q-avatar size="lg" icon="search">
        </q-avatar>
      </template>
    </q-input>
    <q-menu class="input-width" v-model="showMenu" fit anchor="bottom left" self="top left" no-focus>
      <q-item clickable :key="menuItem.label" v-for="menuItem in menuItems" :to="menuItem.link">
        <div class="row">
          <div class="col-1">
            <q-avatar size="sm" :color="menuItem.avatarColor">{{ menuItem.avatar }}</q-avatar>
          </div>
          <div class="col-11">
            <long-string>{{ menuItem.label }}</long-string>
          </div>
        </div>
      </q-item>
    </q-menu>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { SearchMenuItem } from 'src/types/search-menu';
import { getMagellanBaseUrl, getChainId } from 'src/utils/client-utils';
import { search } from 'src/utils/magellan-api-utils';
import { defineComponent, Ref, ref } from 'vue'
import { MagellanSearchResponse, MagellanSearchResultElementType, XPTransactionSearchResult, CTransactionSearchResult, CBlockSearchResult, AddressSearchResult } from 'src/types/magellan-types';
import { getBlockDetailsPath, getTransactionDetailsPath, getAddressDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type';
import LongString from './ui/LongString.vue';

const resultLimit = 6;

async function mapToItem(type: MagellanSearchResultElementType, data: XPTransactionSearchResult | CTransactionSearchResult | CBlockSearchResult | AddressSearchResult): Promise<SearchMenuItem | undefined> {
  switch (type) {
    case MagellanSearchResultElementType.CVM_ADDRESS:
      // currently not implemented
      const cvmAddressData: CTransactionSearchResult = <CTransactionSearchResult>data;
      return {
        label: cvmAddressData.fromAddr,
        type: type,
        link: getAddressDetailsPath(cvmAddressData.address),
        avatar: 'AD',
        avatarColor: 'positive'
      };
    case MagellanSearchResultElementType.C_BLOCK:
      const cBlockData: CBlockSearchResult = <CBlockSearchResult>data;
      return {
        label: cBlockData.Hash,
        type: type,
        link: getBlockDetailsPath(ChainType.C_CHAIN, cBlockData.Block),
        avatar: 'CB',
        avatarColor: 'primary'
      };
    case MagellanSearchResultElementType.C_TRANSACTION:
      const cTransaction: CTransactionSearchResult = <CTransactionSearchResult>data;
      return {
        label: cTransaction.hash,
        type: type,
        link: getTransactionDetailsPath(ChainType.C_CHAIN, cTransaction.hash),
        avatar: 'CT',
        avatarColor: 'info'
      };
    case MagellanSearchResultElementType.XP_TRANSACTION:
      const xpTransaction: XPTransactionSearchResult = <XPTransactionSearchResult>data;
      let detailsLink = '';
      let avatar = '';
      let avatarColor = ''
      const actualChainId = xpTransaction.chainID;
      if (actualChainId === await getChainId('p')) {
        detailsLink = getTransactionDetailsPath(ChainType.P_CHAIN, xpTransaction.id)
        avatar = 'PT'
        avatarColor = 'accent'
      } else {
        detailsLink = getTransactionDetailsPath(ChainType.X_CHAIN, xpTransaction.id)
        avatar = 'XT'
        avatarColor = 'secondary'
      }
      return {
        label: xpTransaction.id,
        type: type,
        link: detailsLink,
        avatar: avatar,
        avatarColor: avatarColor
      };
    default:
      console.log('Got unknown response type from search', + type);
      return undefined;
  }
}

export default defineComponent({
  name: 'SearchInput',
  setup() {
    const searchInput: Ref<string> = ref('');
    const menuItems: Ref<SearchMenuItem[]> = ref([]);
    const showMenu: Ref<boolean> = ref(false);
    return {
      searchInput,
      menuItems,
      showMenu,
      search: async () => {
        if (!searchInput.value || searchInput.value.length < 1) {
          menuItems.value = [];
          showMenu.value = false;
          return;
        }
        const data: MagellanSearchResponse = await (await axios.get(`${getMagellanBaseUrl()}${search}?query=${searchInput.value}&limit=${resultLimit}`)).data;
        const newMenuItems: SearchMenuItem[] = [];
        for (let i = 0; i < data.results.length; i++) {
          const element = data.results[i];
          const mapItem = await mapToItem(element.type, element.data);
          if (mapItem) {
            newMenuItems.push(mapItem);
          }
        }
        if (newMenuItems && newMenuItems.length) {
          showMenu.value = true;
        }
        menuItems.value = newMenuItems;
      },
      getColorForType(type: string) {
        switch (type) {
          default:
            return 'blue';
        }
      },
      getIconForType(type: string) {
        switch (type) {
          default:
            return 'blue';
        }
      }
    };
  },
  components: { LongString }
});
</script>

<style lang="sass">
.input-width
  max-width: 75%
</style>
