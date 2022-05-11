<template>
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ChainOverviewLayout',
  components: {},
  setup() {
    const startupErrorCaptured = ref(false);
    return {

      startupErrorCaptured

    };
  },
})
</script>
<style scoped lang="sass">

.logo-container
  display: flex
  align-items: center

</style>
