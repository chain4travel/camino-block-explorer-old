<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-subtitle1 col-11">{{ title }}</div>
        <div class="col-1">
          <q-btn color="primary" icon="mdi-refresh" @click="() => $emit('refresh')" />
        </div>
      </div>
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
  emits: ['refresh'],
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
