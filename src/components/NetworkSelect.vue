<template>
  <div>
    <q-select dense dark rounded outlined v-model="selectedNetwork" :options="networkOptions"
      @update:model-value="networkSelectionChanged">
      <template v-slot:prepend>
        <q-icon class="text-white" size="xs" name="mdi-web" />
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" :class="scope.opt.value === undefined ? 'primary-clickable' : ''">
          <q-item-section>
            <q-item-label>
              {{ scope.opt.label }}
            </q-item-label>
          </q-item-section>
          <q-item-section v-if="canBeDeleted(scope.opt.value, scope.selected)" side top>
            <q-btn @click.stop="removeNetworkOption(scope.index)" round size="sm" color="primary"
              icon="mdi-delete-forever" />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <AddNetworkDialog v-model="showNewNetworkDialog" @new-network="createNewNetwork" />
  </div>
</template>

<script lang="ts">
import { useAppConfig } from 'src/stores/app-config';
import { Network } from 'src/types/network'
import { defineComponent, ref } from 'vue';
import AddNetworkDialog from 'src/components/dialogs/AddNetworkDialog.vue';

function createNetworkOptions(networks: Network[]): Array<{ label: string, value: Network | undefined }> {
  const networkOptions = networks.map(network => ({
    label: network.displayName,
    value: network as Network | undefined
  }));
  networkOptions.push({ label: 'Create new Network', value: undefined });
  return networkOptions
}

export default defineComponent({
  name: 'NetworkSelect',
  setup() {
    const appConfig = useAppConfig();
    const showNewNetworkDialog = ref(false);
    const networkOptions = ref(createNetworkOptions(appConfig.getAllNetworks));
    const selectedNetwork = ref(networkOptions.value.find(e => e.value === appConfig.getActive) || networkOptions.value[0])
    return {
      networkOptions,
      selectedNetwork,
      showNewNetworkDialog,
      networkSelectionChanged(selectedOption: { label: string, value: Network }) {
        if (selectedOption.value === undefined) {
          showNewNetworkDialog.value = true;
        } else {
          //TODO handle sucess/not success!
          appConfig.setActive(selectedOption.value.id)
        }
      },
      createNewNetwork(value: Network) {
        if (!value.magellanAddress) {
          value.magellanAddress = `${value.protocol}://${value.host}:${value.port}/magellan`
        }
        appConfig.pushNetwork(value);
        appConfig.setActive(value.id);
        selectedNetwork.value = { label: value.displayName, value: value }
        networkOptions.value.splice(networkOptions.value.length - 1, 0, { label: value.displayName, value: value })
        showNewNetworkDialog.value = false;
      },
      removeNetworkOption(index: number) {
        const network = networkOptions.value[index];
        if (network.value === undefined) {
          return;
        }
        appConfig.removeNetwork(network.value.id)
        networkOptions.value = createNetworkOptions(appConfig.getAllNetworks);
      },
      canBeDeleted(value: Network, selected: boolean) {
        return value !== undefined && !value.predefined && !selected
      }
    }
  },
  components: { AddNetworkDialog }
})
</script>
<style scoped lang="sass">
.primary-clickable
  background-color: $primary
</style>
