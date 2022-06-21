<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-h6 col-xs-grow">{{ title }}</div>
        <div class="col-xs-auto text-right">
          <q-btn
            v-if="!hideRefresh"
            outline
            rounded
            color="primary"
            icon="mdi-refresh"
            @click="() => $emit('refresh')"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="items.length > 0">
      <q-list dense separator class="limit-height">
        <div v-for="(item, index) in items" :key="index" clickable>
          <slot :item="item"></slot>
          <q-separator v-if="index !== items.length - 1"></q-separator>
        </div>
      </q-list>
    </q-card-section>
    <q-card-section v-else class="container">
      <div class="text-body1">No Elements found</div>
    </q-card-section>
    <q-card-actions v-if="showAllLink" class="justify-center">
      <q-btn outline rounded :to="showAllLink" color="primary" class="col-6">
        Show All
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ListCard',
  emits: ['refresh'],
  props: {
    title: { type: String, required: false },
    items: { type: Array, required: true },
    showAllLink: { type: String, required: false },
    hideRefresh: { type: Boolean, default: false },
  },
});
</script>
