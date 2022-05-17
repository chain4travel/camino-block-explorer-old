<template>
  <div v-if="$q.screen.gt.sm" class="search-banner q-mr-md">
    <search-input />
  </div>
  <div v-if="$q.screen.lt.md">
    <q-btn class="navigation-link" @click="() => openDialog = true" icon="search" rounded dense></q-btn>
    <q-dialog v-model="openDialog">
      <q-card class="pwpl-md-size">
        <q-card-section>
          <div class="text-center text-h6 text-bold">Search for anything</div>
        </q-card-section>
        <q-card-section>
          <SearchInput />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SearchInput from './SearchInput.vue';


export default defineComponent({
  name: 'SearchBanner',
  setup() {
    return {
      openDialog: ref(false),
    };
  },
  components: { SearchInput }
});
</script>
<style lang="sass" scoped>
.search-banner
  min-width: 400px
  max-height: 40px
</style>

