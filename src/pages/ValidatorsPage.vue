<template>
  <div class="row justify-center">
    <div class="col-12">
      <q-card>
        <q-card-section>
          <div class="row items-center">
            <q-btn
              icon="mdi-chevron-left"
              class="col-auto"
              size="md"
              rounded
              outline
              color="primary"
              to="/"
            >
            </q-btn>
            <div class="text-h5 q-pl-md col-10">Validators</div>
          </div>
        </q-card-section>
        <q-card-section class="no-shadow">
          <q-table
            v-if="loadedValidators?.length > 0"
            class="my-sticky-dynamic monospace no-shadow text-h6"
            table-header-class="q-card monospace text-h6"
            card-class="q-card light-level-1"
            color="light-level-1"
            table-class="q-card"
            :rows="loadedValidators"
            :columns="columns"
            row-key="name"
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
            :virtual-scroll-item-size="48"
            :virtual-scroll-sticky-size-start="48"
            :pagination="pagination"
            @virtual-scroll="onScroll"
            hide-bottom
          >
            <template v-slot:body-cell-connected="props">
              <q-td :props="props">
                <div
                  v-if="!props.value"
                  class="row items-center space-between no-wrap"
                >
                  <q-badge
                    text-color="black"
                    color="negative"
                    class="q-px-md q-py-sm monospace"
                    label="Disconnected"
                  />
                </div>
                <div v-else class="row items-center space-between no-wrap">
                  <q-badge
                    text-color="black"
                    color="accent"
                    class="q-px-md q-py-sm monospace"
                    label="Connected"
                  />
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-uptime="props">
              <q-td :props="props">{{ Math.round(props.value * 100) }}%</q-td>
            </template>
            <template v-slot:body-cell-startTime="props">
              <q-td :props="props">
                {{ formatDate(new Date(parseInt(props.value))) }}
              </q-td>
            </template>
            <template v-slot:body-cell-endTime="props">
              <q-td :props="props">
                {{ formatDate(new Date(parseInt(props.value))) }}
              </q-td>
            </template>
            <template v-slot:body-cell-nodeID="props">
              <q-td :props="props">
                <div>
                  <address-link
                    :xl-length="36"
                    :lg-length="15"
                    :md-length="7"
                    :sm-length="70"
                    :xs-length="30"
                    class="monospace"
                    :value="props.value"
                    to="/"
                  ></address-link>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-txID="props">
              <q-td :props="props">
                <div>
                  <address-link
                    :xl-length="36"
                    :lg-length="15"
                    :md-length="7"
                    :sm-length="70"
                    :xs-length="30"
                    class="monospace"
                    :value="props.value"
                    to="/"
                  ></address-link>
                </div>
              </q-td>
            </template>
          </q-table>
          <q-card
            v-else
            style="height: 500px"
            class="row items-center justify-center"
          >
            <q-spinner-dots color="primary" size="lg"
          /></q-card>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from 'vue';
import { usePIndexStore } from 'src/stores/p-index-store';
import AddressLink from 'src/components/ui/AddressLink.vue';
import { formatDate } from 'src/utils/display-utils';

// we generate lots of rows here
const columns = [
  {
    name: 'connected',
    field: 'connected',
    required: false,
    label: 'status',
    align: 'left',
  },
  {
    name: 'nodeID',
    field: 'nodeID',
    align: 'center',
    label: 'nodeID',
  },
  {
    name: 'startTime',
    field: 'startTime',
    align: 'center',
    label: 'startTime',
  },
  {
    name: 'endTime',
    field: 'endTime',
    align: 'center',
    label: 'endTime',
  },
  {
    name: 'uptime',
    field: 'uptime',
    align: 'center',
    label: 'uptime',
  },
  {
    name: 'txID',
    field: 'txID',
    align: 'center',
    label: 'txID',
  },
];
export default defineComponent({
  name: 'ValidatorsPage',
  components: { AddressLink },
  async setup() {
    const loading = ref(false);

    const rows = computed(() => {
      return loadedValidators;
    });
    const store = usePIndexStore();

    return {
      formatDate,
      onScroll({ to, ref }) {
        const lastIndex = rows.value.length - 1;
        if (loading.value !== true && to === lastIndex) {
          loading.value = true;

          setTimeout(() => {
            nextTick(() => {
              ref.refresh();
              loading.value = false;
            });
          }, 500);
        }
      },
      rows,
      columns,
      pagination: ref({
        rowsPerPage: 0,
      }),
      loadedValidators: await store.getValidators(),
    };
  },
});
</script>

<style lang="sass">
.my-sticky-dynamic
  height: 500px
  thead tr th
    text-align : start
    position: sticky
    font-size : 15px
    z-index: 1
  thead tr:last-child th
    top: 48px
  thead tr:first-child th
    top: 0
  td
    text-align : start
</style>
