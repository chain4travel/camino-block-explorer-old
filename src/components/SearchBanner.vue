<template>
  <q-card class="justify-center own-bg">
    <q-card-section class="min-height container q-pt-xl q-pb-xl text-center">
      <div class="row">
        <div class="col-12 justify.center text-center text-h2 text-bold">Explore the true potential of travel.</div>
      </div>
      <div class="row">
        <div class="offset-4 q-mt-xl col-4">
          <q-input rounded label="Search by Address / Hash /Block / Token" dark outlined v-model="searchInput"
            clearable>
            <template v-slot:prepend>
              <q-avatar size="lg" color="dark" text-color="white" icon="search">
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
.own-bg
  background: $background-card
  color: white
.min-height
  min-height: 200px
</style>
