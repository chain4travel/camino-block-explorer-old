<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar color="toolbar">
        <q-toolbar-title>
          <div class="logo-container">
            <q-img src="src/assets/camino-company-logo.png" height="32px" width="120px">
            </q-img>
            <router-link class="text-accent q-ml-xs q-mt-xs" to="/">{{ t("explorer") }}</router-link>
          </div>
        </q-toolbar-title>

        <div class="logo-container">
          <router-link class="text-white q-mr-md no-underscore" v-for="route in menuRoutes" :key="route?.name"
            :to="{ name: route?.name }">
            {{ route?.name }} </router-link>
          <a class="text-white q-mr-md no-underscore" v-for="link in additionalMenuItems" :key="link.name"
            :href="link.href" target="_blank">{{ link.name }}</a>
          <q-select dense dark rounded outlined v-model="selectedNetwork" :options="networkOptions"
            @update:model-value="networkSelectionChanged">
            <template v-slot:prepend>
              <q-icon class="text-white" size="xs" name="mdi-web" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" :class="scope.opt.value === undefined ? 'test' : ''">
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.label }}
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="canBeDeleted(scope.opt.value, scope.selected)" side top>
                  <q-btn @click.stop="removeNetworkOption(scope.index)" round size="sm" color="primary"
                    icon="mdi-delete-forever" />
                </q-item-section>
              </q-item>
            </template>

          </q-select>
        </div>
      </q-toolbar>
    </q-header>
    <!-- mobile??? -->
    <q-drawer class="bg-dark" v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list dense>
          <template v-for="(menuItem, index) in menuRoutes" :key="index">
            <q-item :to="{ name: menuItem.name }" clickable :active="menuItem.name === $route.name" v-ripple>
              <q-item-section avatar>
                <q-icon v-if="menuItem.meta?.icon" :name="menuItem.meta.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.name }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <AddNetworkDialog v-model="showNewNetworkDialog" @new-network="createNewNetwork" />

    <body>
      <q-page-container>
        <Suspense>
          <router-view />
        </Suspense>
      </q-page-container>
    </body>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import { RouteRecordRaw, useRouter } from 'vue-router';
import type { ExternalMenuLink } from 'src/types/external-menu-link';
import AddNetworkDialog from 'src/components/dialogs/AddNetworkDialog.vue';
import { useAppConfig } from 'src/stores/app-config';
import { Network } from 'src/types/network';

const leftDrawerOpen = ref(false)

function addAllChildRoutes(gathered: Array<RouteRecordRaw>, route: RouteRecordRaw) {
  if (route.children) {
    gathered.push(...route.children);
    route.children.forEach(child => addAllChildRoutes(gathered, child))
  }
}

function createNetworkOptions(networks: Network[]): Array<{ label: string, value: Network | undefined }> {
  const networkOptions = networks.map(network => ({
    label: network.displayName,
    value: network as Network | undefined
  }));
  networkOptions.push({ label: 'Create new Network', value: undefined });
  return networkOptions
}

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const appConfig = useAppConfig();
    leftDrawerOpen.value = false;
    // Can be optimized to filter earlier and not gather all routes
    let allRoutes: Array<RouteRecordRaw> = [];
    router.options.routes.forEach(route => {
      allRoutes.push(route);
      addAllChildRoutes(allRoutes, route);
    });
    const menuRoutes = allRoutes.filter(e => e?.meta?.showInMenu);
    const additionalMenuItems = [
      { name: 'Documentation', href: 'https://docs.camino.foundation' },
      { name: 'Wallet', href: 'https://wallet.camino.foundation' }
    ] as ExternalMenuLink[];
    const showNewNetworkDialog = ref(false);
    const networkOptions = ref(createNetworkOptions(appConfig.getAllNetworks));
    const selectedNetwork = ref(networkOptions.value.find(e => e.value === appConfig.getActive) || networkOptions.value[0])
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      t,
      menuRoutes,
      additionalMenuItems,
      networkOptions,
      selectedNetwork,
      showNewNetworkDialog,
      networkSelectionChanged(selectedOption: { label: string, value: Network }) {
        if (selectedOption.value === undefined) {
          showNewNetworkDialog.value = true;
        } else {
          //TODO handle sucess/not success!
          appConfig.setActive(selectedOption.value.id)
        }
      },
      createNewNetwork(value: Network) {
        appConfig.pushNetwork(value);
        appConfig.setActive(value.id);
        selectedNetwork.value = { label: value.displayName, value: value }
        networkOptions.value.splice(networkOptions.value.length - 1, 0, { label: value.displayName, value: value })
        showNewNetworkDialog.value = false;
      },
      removeNetworkOption(index: number) {
        const network = networkOptions.value[index];
        if (network.value === undefined) {
          return;
        }
        appConfig.removeNetwork(network.value.id)
        networkOptions.value = createNetworkOptions(appConfig.getAllNetworks);
      },
      canBeDeleted(value: Network, selected: boolean) {
        return value !== undefined && !value.predefined && !selected
      }
    };
  },
  components: { AddNetworkDialog }
})
</script>
<style scoped lang="sass">
.bg-toolbar
  background: $toolbar !important
a
  text-decoration: none
.logo-container
  display: flex
  align-items: center
.router-link-exact-active
  color: $primary !important
.test
  background-color: $primary
</style>
