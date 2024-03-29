<template>
  <q-dialog
    @before-hide="onClose"
    @before-show="initForm"
    class="dialog-sizing"
    v-model="show"
  >
    <q-card class="pwpl-md-size">
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="form.displayName"
            label="Display Name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            filled
            v-model="form.protocol"
            label="Protocol"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            filled
            v-model="form.host"
            label="Host"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            type="number"
            filled
            v-model.number="form.port"
            label="Port"
            lazy-rules
            :rules="[(val) => (val && val > 0) || 'Please type something']"
          />
          <q-input
            filled
            v-model="form.magellanAddress"
            label="Magellan Address"
          />
          <q-card-actions>
            <q-btn
              outline
              rounded
              class="btn-size"
              icon="cancel"
              label="Cancel"
              @click="onClose"
              color="primary"
            />
            <q-btn
              rounded
              class="btn-size"
              icon="save"
              label="Save"
              type="submit"
              color="primary"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useModelWrapper } from 'src/composables/model-wrapper';
import { useAppConfig } from 'src/stores/app-config';
import { Network } from 'src/types/network';
import { defineComponent, Ref, ref } from 'vue';

const maxIterations = 10000;
const baseCustomId = 'custom-network-';

function generateNextCustomId(allNetworks: Network[]) {
  let found = false;
  let currentCounter = allNetworks.length;
  let nextId: string = baseCustomId + currentCounter;
  // technically incorrect as current counter isn't apure counter, just to make sure it is not an endless loop
  while (!found && currentCounter < maxIterations) {
    if (allNetworks.find((e) => e.id === nextId) === undefined) {
      return nextId;
    }
    currentCounter++;
    nextId = baseCustomId + currentCounter;
  }
  throw new Error('could not generate network id');
}

export default defineComponent({
  name: 'AddNetworkDialog',
  props: {
    modelValue: Boolean,
  },
  setup(props, { emit }) {
    const appConfig = useAppConfig();
    const form: Ref<Network> = ref({
      id: generateNextCustomId(appConfig.getAllNetworks),
      displayName: 'My New Network',
      protocol: 'http',
      host: '127.0.0.1',
      port: 9650,
      magellanAddress: '',
    });
    let show = useModelWrapper(props, emit, 'modelValue');

    return {
      show,
      form,
      onSubmit() {
        emit('new-network', form.value);
      },
      onClose() {
        emit('cancel');
        show.value = false;
      },
      initForm() {
        const allNetworks = appConfig.getAllNetworks;
        form.value = {
          id: generateNextCustomId(allNetworks),
          displayName: 'My New Network',
          protocol: 'http',
          host: '127.0.0.1',
          port: 9650,
          magellanAddress: '',
        };
      },
    };
  },
});
</script>
<style scoped lang="sass">
.dialog-sizing
  min-width: 350px
.btn-size
  min-width: 130px
</style>
