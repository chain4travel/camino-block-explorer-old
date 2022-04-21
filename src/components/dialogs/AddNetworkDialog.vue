<template>
  <q-dialog class="dialog-sizing" v-model="show">
    <q-card class="pwpl-md-size">
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="form.displayName" label="Display Name" lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type something']" />
          <q-input filled v-model="form.protocol" label="Protocol" lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type something']" />
          <q-input filled v-model="form.host" label="Host" lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type something']" />
          <q-input type="number" filled v-model="form.port" label="Port" lazy-rules
            :rules="[val => val && val > 0 || 'Please type something']" />
          <q-card-actions>
            <q-btn icon-right="cancel" label="Cancel" @click="onClose" />
            <q-btn icon-right="save" label="Create" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">
import { useModelWrapper } from 'src/composables/model-wrapper'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'AddNetworkDialog',
  props: {
    modelValue: Boolean
  },

  setup(props, { emit }) {
    const form = ref({
      name: 'My New Network',
      displayName: 'My New Network',
      protocol: 'http',
      host: '127.0.0.1',
      port: 9650,
    });
    let show = useModelWrapper(props, emit, 'modelValue')

    return {
      show,
      form,
      onSubmit() {
        emit('new-network', form.value)
      },
      onClose() {
        show.value = false;
      }
    }
  }
})
</script>
<style scoped lang="sass">
.dialog-sizing
  width: 350px
</style>
