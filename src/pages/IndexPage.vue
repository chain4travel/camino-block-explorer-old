<template>
  <q-page class="flex flex-center">
    <form @submit.prevent="checkHealth">
      <label for="serverAddr">Server Address:</label><br>
      <input v-model="formData.ip" type="text" id="serverAddr" name="serverAddr"><br>
      <label for="serverPort">Server Port:</label><br>
      <input v-model="formData.port" type="number" id="serverPort" name="serverPort"><br>
      <button type="submit">Test Connection</button>
    </form>
    <div>
      <p>Health Response <br></p>
      <p>{{ healthResponse }}</p>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { useCIndexStore } from 'src/stores/c-index-store';
import { reactive } from 'vue'
import {
  Avalanche,
} from "avalanche"
import { HealthResponse } from 'avalanche/dist/apis/health/interfaces';

const cIndexStore = useCIndexStore();
const formData = reactive({ ip: "127.0.0.1", port: 9650 })

let healthResponse = ref(null);

async function checkHealth() {
  cIndexStore.loadTXs();
}


export default defineComponent({
  name: 'IndexPage',
  setup() {

    return {
      formData,
      checkHealth,
      healthResponse
    }
  }
})
</script>
