<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar color="toolbar">
        <q-btn class="lt-md navigation-link" dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <div class="gt-sm logo-container">
            <router-link class="" :to="homePath">
              <q-img class="dark-logo" src="src/assets/camino-company-logo-dark.png" height="32px" width="244px">
              </q-img>
              <q-img class="light-logo" src="src/assets/camino-company-logo-light.png" height="32px" width="244px">
              </q-img>
            </router-link>
            <div class="text-primary text-caption q-ml-sm q-mb-md">Alpha</div>
          </div>
          <div class="lt-md logo-container">
            <router-link :to="homePath">
              <q-img src="src/assets/camino-company-logo-mobile.png" height="32px" width="32px">
              </q-img>
            </router-link>
          </div>
        </q-toolbar-title>
        <search-banner />
        <network-select />
        <div>
          <q-btn size="sm" class="q-ml-sm navigation-link q-pt-sm" rounded
            :icon="$q.dark.isActive ? 'img:images/night.svg' : 'img:images/day.svg'" @click="toggleDarkMode"></q-btn>
        </div>
      </q-toolbar>
      <q-toolbar class="gt-sm" color="toolbar">
        <div class="logo-container">
          <router-link class="q-mr-md navigation-link" v-for="route in menuRoutes" :key="route?.name"
            :to="{ name: route?.name }">
            {{ route && route.meta && route.meta.label ? route.meta.label : route?.name }}
          </router-link>
          <a class="q-mr-md navigation-link" v-for="link in additionalMenuItems" :key="link.name" :href="link.href"
            target="_blank">{{ link.name }}</a>
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="route in menuRoutes" :key="route?.name">
            <q-item class="navigation-link" :to="{ name: route.name }" clickable :active="route.name === $route.name"
              v-ripple>
              <q-item-section avatar>
                <q-icon v-if="route.meta?.icon" :name="route.meta.icon" />
              </q-item-section>
              <q-item-section>
                {{ route && route.meta && route.meta.label ? route.meta.label : route?.name }}
              </q-item-section>
            </q-item>
          </template>
          <q-separator />
          <template v-for="extRoute in additionalMenuItems" :key="extRoute.name">
            <q-item class="navigation-link" :href="extRoute.href" clickable v-ripple>
              <q-item-section avatar>
                <q-icon v-if="extRoute.icon" :name="extRoute.icon" />
              </q-item-section>
              <q-item-section>
                {{ extRoute.name }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <body>
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
    </body>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onErrorCaptured, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import { RouteRecordRaw, useRouter } from 'vue-router';
import type { ExternalMenuLink } from 'src/types/external-menu-link';

import NetworkSelect from 'src/components/NetworkSelect.vue'
import { useQuasar } from 'quasar';
import { useAppConfig } from 'src/stores/app-config';
import { getOverviewPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import SearchBanner from 'src/components/SearchBanner.vue';

const leftDrawerOpen = ref(false)

function addAllChildRoutes(gathered: Array<RouteRecordRaw>, route: RouteRecordRaw) {
  if (route.children) {
    gathered.push(...route.children);
    route.children.forEach(child => addAllChildRoutes(gathered, child))
  }
}

function getCompanyLogoUrl(isDark: boolean) {
  return `/camino-company-logo-${isDark ? 'dark' : 'light'}.png`
}

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const $q = useQuasar()
    const { t } = useI18n();
    const router = useRouter();
    const appConfig = useAppConfig();
    const startupErrorCaptured = ref(false);
    const companyLogo = ref(getCompanyLogoUrl($q.dark.isActive))
    $q.dark.set(appConfig.darkMode);
    watch(() => $q.dark.isActive, val => {
      companyLogo.value = getCompanyLogoUrl(val);
      appConfig.darkMode = val;
    })

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
      { name: 'Documentation', href: 'https://docs.camino.foundation', icon: 'mdi-school-outline' },
      { name: 'Wallet', href: 'https://wallet.camino.foundation', icon: 'mdi-wallet-travel' }
    ] as ExternalMenuLink[];
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      t,
      menuRoutes,
      additionalMenuItems,
      startupErrorCaptured,
      toggleDarkMode() {
        $q.dark.toggle();
      },
      companyLogo,
      homePath: getOverviewPath(ChainType.C_CHAIN),
      // footerLinks: [
      //   { name: 'Discord', href: 'https://discord.gg/K5THjAweFB' },
      //   { name: 'Twitter', href: 'https://twitter.com/CaminoFndtn' },
      //   { name: 'Telegram', href: 'https://t.me/caminochain' },
      //   { name: 'Medium', href: 'https://medium.com/@caminofoundation' }
      // ]
    };
  },
  components: { NetworkSelect, SearchBanner }
})
</script>
<style scoped lang="sass">

.logo-container
  display: flex
  align-items: center
</style>
