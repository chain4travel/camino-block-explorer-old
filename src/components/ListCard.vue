<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="text-subtitle1">{{ title }}</div>
    </q-card-section>
    <q-card-section v-if="items.length > 0" class="container">
      <q-list dense bordered separator>
        <q-item v-for="item, index in items" :key="index" clickable v-ripple>
          <q-item-section>
            <div class="row">
              <slot :item="item"></slot>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else class="container">
      <div class="text-body1">No Elements found</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ListCard',
  props: {
    title: { type: String, required: false },
    items: { type: Array, required: true }
  }
})
</script>

<style scoped lang="sass">
* 
  background: #27324C
  color: white
</style>