<template>
  <q-card class="justify-center">
    <q-card-section class="min-height container q-pt-lg q-pb-xl text-center">
      <div class="row">
        <div :class="'col-12 justify.center text-center text-bold ' + ($q.screen.lt.md ? 'text-h6' : 'text-h3')">
          Explore the true potential of travel.
        </div>
      </div>
      <div class="row">
        <div :class="'offset-md-4 col-md-4 col-12' + ($q.screen.lt.md ? '' : ' q-mt-xl')">
          <q-input bg-color="search-banner-input" rounded label="Search by Address / Hash / Block" outlined
            v-model="searchInput" clearable @update:model-value="search">
            <template v-slot:prepend>
              <q-avatar color="search-banner-icon" size="lg" icon="search">
              </q-avatar>
            </template>
          </q-input>
          <q-menu v-model="showMenu" fit anchor="bottom left" self="top left" no-focus>
            <q-item clickable :key="menuItem.label" v-for="menuItem in menuItems" :to="menuItem.link">
              <q-item-section>
                <div class="row">
                  <div class="col-1">
                    <q-avatar size="sm" :color="menuItem.avatarColor">{{ menuItem.avatar }}</q-avatar>
                  </div>
                  <div class="col-11">
                    <long-string>{{ menuItem.label }}</long-string>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-menu>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import axios from 'axios';
import { SearchMenuItem } from 'src/types/search-menu';
import { getMagellanBaseUrl, getChainId } from 'src/utils/client-utils';
import { search } from 'src/utils/magellan-api-utils';
import { defineComponent, Ref, ref } from 'vue'
import { MagellanSearchResponse, MagellanSearchResultElementType, XPTransactionSearchResult, CTransactionSearchResult, CBlockSearchResult, AddressSearchResult } from 'src/types/magellan-types';
import { getBlockDetailsPath, getTransactionDetailsPath } from 'src/utils/route-utils'
import { ChainType } from 'src/types/chain-type';
import LongString from './ui/LongString.vue';

const resultLimit = 10;

async function mapToItem(type: MagellanSearchResultElementType, data: XPTransactionSearchResult | CTransactionSearchResult | CBlockSearchResult | AddressSearchResult): Promise<SearchMenuItem | undefined> {
  switch (type) {
    case MagellanSearchResultElementType.ADDRESS:
      // currently not implemented
      return undefined;
    case MagellanSearchResultElementType.C_BLOCK:
      const cBlockData: CBlockSearchResult = <CBlockSearchResult> data;
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
        avatar:avatar,
        avatarColor: avatarColor
      };
    default:
      console.log('Got unknown response type from search', + type);
      return undefined;
  }
}

export default defineComponent({
  name: 'SearchBanner',
  setup() {
    const searchInput: Ref<string> = ref('');
    const menuItems: Ref<SearchMenuItem[]> = ref([]);
    const showMenu: Ref<boolean> = ref(false);
    return {
      searchInput,
      menuItems,
      showMenu,
      search: async () => {
        console.log('searchInput.value', searchInput.value)
        if(!searchInput.value || searchInput.value.length < 1){
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
<style scoped lang="sass">
.min-height
  min-height: 200px
  max-height: 23vh
</style>
