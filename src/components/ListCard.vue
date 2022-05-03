<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-h6 col-11">{{ title }}</div>
        <div class="col-1 text-right">
          <q-btn rounded color="primary" icon="mdi-refresh" @click="() => $emit('refresh')" />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="items.length > 0">
      <q-list dense separator dark>
        <q-item class="limit-height" v-for="item, index in items" :key="index" clickable v-ripple>
          <q-item-section>
            <slot :item="item"></slot>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else class="container">
      <div class="text-body1">No Elements found</div>
    </q-card-section>
    <q-card-actions v-if="showAllLink" class="justify-center">
      <q-btn rounded :to="showAllLink" color="white" text-color="black" class="col-6">
        Show All
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ListCard',
  emits: ['refresh'],
  props: {
    title: { type: String, required: false },
    items: { type: Array, required: true },
    showAllLink: { type: String, required: false },
  }
})
</script>

<style scoped lang="sass">
*
  background: $background-card
  color: white
.limit-height
  min-height: 70px
</style>
