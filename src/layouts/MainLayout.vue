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

        <router-link class="text-white q-mr-md no-underscore" v-for="route in menuRoutes" :key="route?.name"
          :to="route?.name">
          {{ route?.name }} </router-link>
      </q-toolbar>
    </q-header>
    <!-- mobile??? -->
    <q-drawer class="bg-dark" v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list dense>
          <template v-for="(menuItem, index) in menuRoutes" :key="index">
            <q-item :to="{ name: menuItem.name }" clickable :active="menuItem.name === $route.name" v-ripple>
              <q-item-section avatar>
                <q-icon v-if="menuItem.meta?.icon" :name="menuItem.meta?.icon" />
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
    console.log('drawer', leftDrawerOpen)
    leftDrawerOpen.value = false;
    // Can be optimized to filter earlier and not gather all routes
    let allRoutes: Array<RouteRecordRaw> = [];
    router.options.routes.forEach(route => {
      allRoutes.push(route);
      addAllChildRoutes(allRoutes, route);
    });
    const menuRoutes = allRoutes.filter(e => e?.meta?.showInMenu)
    const tabRoutes = allRoutes.filter(e => e?.meta?.showInTabBar)
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      t,
      menuRoutes,
      tabRoutes
    }
  }
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
</style>