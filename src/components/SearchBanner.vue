<template>
  <q-card class="headline-card text-white text-center">
    <q-img src="src/assets/banner-bg.png" height="100%">
      <div class="absolute-center img-caption">
        <div class="text-h2 q-mt-xl ">Explore the true potential of travel.</div>
        <q-card-section class="container q-mt-xl">
          <q-input label="Search by Address / Hash /Block / Token" dark outlined v-model="searchInput" clearable>
            <template v-slot:prepend>
              <q-avatar size="lg" color="dark" text-color="white" icon="search">
              </q-avatar>
            </template>
            <template v-slot:append>
              <q-btn icon="mdi-arrow-right" color="primary" round @click="search">
              </q-btn>
            </template>
          </q-input>
        </q-card-section>
      </div>
    </q-img>
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
.search-icon
  background: #141A18
  border-radius: 30px
  display: flex
  align-items: center
  align-content: flex-start
  justify-content: center
  justify-items: center
.append-icon
  color: white
  background-color: $primary
.headline-card
  width: 100%
  max-height: 22em
  background: black
  align-items: center
.img-caption
  background: none
</style>
