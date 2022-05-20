<template>
  <q-btn class="q-mx-md q-ml-xs" @click="() => copyToClipBoard(value.toString())" size="sm" outline
  rounded icon="mdi-content-copy">
  <slot></slot>
  </q-btn>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'CopyButton',
  props: {
    value: { type: String, required: true },
  },
  setup() {
    return {
      copyToClipBoard: async function (value: string) {
        await navigator.clipboard.writeText(value);
        Notify.create({
          message: 'Value copied to Clipboard',
          closeBtn: true,
          timeout: 500
        })
      }

    }
  },
  components: {  }
})
</script>
