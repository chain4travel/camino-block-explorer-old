<template>
  <q-card>
    <q-card-section  v-if="title">
      <div class="row items-end">
        <div class="text-subtitle1 q-pl-md text-center col-12">{{ title }}</div>
      </div>
    </q-card-section>

    <q-card-section class="text-center">
      <slot></slot>
    </q-card-section>

  </q-card>
</template>

<script lang="ts">
import { useModelWrapper } from 'src/composables/model-wrapper';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DataCard',
  props: {
    title: { type: String, required: false },
    value: { type: [String, Number], required: false },
  },
  async setup(props, { emit }) {

    let selected = useModelWrapper(props, emit, 'selectedOption')

    return {
      selected
    }
  }
})
</script>
