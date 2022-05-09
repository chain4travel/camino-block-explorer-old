<template>
  <q-card class="justify-center">
    <q-card-section class="min-height container q-pt-lg q-pb-xl text-center">
      <div class="row">
        <div :class="'col-12 justify.center text-center text-bold ' + ($q.screen.lt.md ? 'text-h6' : 'text-h3')">
          Explore the true potential of travel.
        </div>
      </div>
      <div class="row">
        <div :class="'offset-md-4 col-md-4 col-12' + ($q.screen.lt.md ? '': ' q-mt-xl' )">
          <q-input  bg-color="search-banner-input" rounded label="Search by Address / Hash / Block / Token" outlined
            v-model="searchInput" clearable>
            <template v-slot:prepend>
              <q-avatar color="search-banner-icon" size="lg" icon="search">
              </q-avatar>
            </template>
            <template v-slot:append>
              <q-btn icon="mdi-arrow-right" color="primary" round @click="search">
              </q-btn>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'

let searchInput: Ref<string> = ref('');
export default defineComponent({
  name: 'SearchBanner',
  emits: ['search'],
  setup(props, { emit }) {
    return {
      searchInput,
      search: () => {
        emit('search', searchInput.value)
      }
    }
  }
})
</script>
<style scoped lang="sass">
.min-height
  min-height: 200px
  max-height: 23vh
</style>
