<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar color="toolbar">
        <q-toolbar-title>
          <div class="logo-container">
            <q-img src="src/assets/camino-company-logo.png" height="32px" width="120px">
            </q-img>
            <router-link class="text-accent q-ml-xs q-mt-xs" :to="{
              path: '/'
            }">{{ "Explorer" }}</router-link>
            <div class="text-accent text-caption q-ml-xs q-mt-xs">Alpha</div>
          </div>
        </q-toolbar-title>

        <div class="logo-container">
          <router-link class="text-white q-mr-md no-underscore" v-for="route in menuRoutes" :key="route?.name"
            :to="{ name: route?.name }">
            {{ route?.name }} </router-link>
          <a class="text-white q-mr-md no-underscore" v-for="link in additionalMenuItems" :key="link.name"
            :href="link.href" target="_blank">{{ link.name }}</a>
          <network-select />
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

    <body>
      <q-page-container>
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            <div class="row">
              <h5 class="col text-center" v-if="startupErrorCaptured">{{ "Error Initialising" }}</h5>
              <q-spinner class="justify-center col" v-else color="primary" size="5em" />
            </div>
          </template>

        </Suspense>
      </q-page-container>
    </body>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onErrorCaptured, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import { RouteRecordRaw, useRouter } from 'vue-router';
import type { ExternalMenuLink } from 'src/types/external-menu-link';

import NetworkSelect from 'src/components/NetworkSelect.vue'

const leftDrawerOpen = ref(false)

function addAllChildRoutes(gathered: Array<RouteRecordRaw>, route: RouteRecordRaw) {
  if (route.children) {
    gathered.push(...route.children);
    route.children.forEach(child => addAllChildRoutes(gathered, child))
  }
}

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const startupErrorCaptured = ref(false);
    onErrorCaptured(() => {
      startupErrorCaptured.value = true;
    })
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
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      t,
      menuRoutes,
      additionalMenuItems,
      startupErrorCaptured
    };
  },
  components: { NetworkSelect }
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
</style>
