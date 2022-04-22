<template>
  <div class=" text-center">
    <div>
      <h2>
        404 Page Not Found
      </h2>
      <q-btn class="q-mt-xl" color="primary" :to="{ name: 'C-Chain' }" label="Back to Home" no-caps />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
