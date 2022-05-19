<template>
  <div :class="$q.screen.lt.md ? '' : 'q-pa-md'">
    <q-table :grid="$q.screen.lt.sm" class="sticky-headers" :title="title" :rows="data" :columns="computedColumns"
      :loading="loading" row-key="index" virtual-scroll :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]" @virtual-scroll="onScroll">
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <div v-if="props.col && props.col.type === 'currency'">
            <q-chip class="chip-placing">
              <q-icon size="sm" :left="true" name="img:/images/camino-coin-logo.png"></q-icon>
              {{ props.value }}
            </q-chip>
          </div>
          <div v-else-if="props.value && props.col && props.col.type === 'hash'">
            <AddressLink v-if="props.col.detailsLink" class="monospace" :to="props.col.detailsLink(props.value)"
              :value="props.value" :xl-length="26" :lg-length="15" :md-length="7" :sm-length="10" :xs-length="10">
            </AddressLink>
            <LongString v-else class="monospace" :value="props.value" :xl-length="26" :lg-length="15" :md-length="7"
              :sm-length="10" :xs-length="10"></LongString>
          </div>
          <div v-else-if="props.col && props.col.type === 'status'">
            <q-chip class="chip-placing">
              {{ props.value }}
            </q-chip>
          </div>
          <div v-else class="overflow-handle">
            {{ props.value }}
          </div>
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-btn outline rounded color="primary" icon="mdi-refresh" @click="() => refresh()" />
      </template>
      <template v-slot:bottom>
        <q-btn outline v-if="backAddr" rounded color="primary" size="md" icon="mdi-chevron-left"
          @click="() => $router.push(backAddr)" />
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card>
            <div class="q-py-sm">
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ col.label }}</div>
                    <div class="q-table__grid-item-value">
                      <div v-if="col && col.type === 'currency'">
                        <q-chip class="chip-placing">
                          <q-icon size="sm" :left="true" name="img:/images/camino-coin-logo.png"></q-icon>
                          {{ col.value }}
                        </q-chip>
                      </div>
                      <div v-else-if="col.value && col && col.type === 'address'">
                        <AddressLink class="monospace" :to="getAddressDetailsPath(col.value)" :value="col.value"
                          :xl-length="26" :lg-length="15" :md-length="7" :sm-length="10" :xs-length="10"></AddressLink>
                      </div>
                      <div v-else-if="col.value && col && col.type === 'transaction' && detailsLink">
                        <AddressLink class="monospace" :value="col.value" :to="detailsLink(col.value)" :xl-length="32"
                          :lg-length="20" :md-length="9" :sm-length="12" :xs-length="12"></AddressLink>
                      </div>
                      <div v-else class="overflow-handle">
                        {{ col.value }}
                      </div>
                    </div>
                  </div>
                </q-item>
                <q-item class="justify-end text-right">
                  <q-btn @click="() => $emit('row-clicked', props.row)" class="square-background" size="sm" outline
                    color="primary" rounded icon="search"></q-btn>
                </q-item>
              </q-list>
            </div>
          </q-card>
          <div class="q-pt-lg text-right" v-if="props.rowIndex === data.length - 1 && requireLoadMore(data)">
            <q-btn :loading="loading" :disable="loading" @click="() => onScroll({ to: props.rowIndex })"
              class="square-background" size="sm" outline color="primary" rounded icon="mdi-chevron-down">Load More
            </q-btn>
          </div>
        </div>
      </template>
      <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue';
import { BlockTableData } from 'src/types/block';
import { ChainLoader } from 'src/types/chain-loader';
import { computed } from '@vue/reactivity';
import AddressLink from './ui/AddressLink.vue';
import { getAddressDetailsPath } from 'src/utils/route-utils';
import LongString from './ui/LongString.vue';

const pageSize = 20;

export default defineComponent({
  name: 'DetailsTable',
  props: {
    store: { type: Object as PropType<ChainLoader>, required: true },
    title: { type: String, required: true },
    columns: { type: Array as PropType<Array<{ style?: string, width?: number }>>, required: true },
    loadData: { type: Function, required: true },
    requireLoadMore: { type: Function, required: true },
    backAddr: { type: String, requried: false },
    detailsLink: { type: Function, required: false },
  },
  emits: ['row-clicked'],
  async setup(props) {
    const computedColumns = computed(() => {
      return props.columns;
    })
    const loading = ref(false);

    let knownHashes: string[] = [];
    const data: Ref<BlockTableData[]> = ref([]);
    const currentOffset = ref(0);
    props.loadData(props.store, knownHashes, 0, pageSize).then((initData: BlockTableData[]) => {
      data.value = initData;
      currentOffset.value = initData.length;
    });



    console.log('in setup!')

    return {
      getAddressDetailsPath,
      computedColumns,
      data: data,
      loading,
      pagination: { rowsPerPage: 0 },
      async refresh() {
        loading.value = true;
        currentOffset.value = 0;
        knownHashes = [];
        data.value = await props.loadData(props.store, knownHashes, currentOffset.value, pageSize);
        currentOffset.value += data.value.length;
        loading.value = false;
      },
      async onScroll({ to }: {
        to: number;
      }) {
        const lastIndex = data.value.length - 1;
        if (loading.value !== true && to === lastIndex && props.requireLoadMore(data.value)) {
          loading.value = true;
          const apiData = await props.loadData(props.store, knownHashes, currentOffset.value, pageSize);
          currentOffset.value += apiData.length || 1;
          data.value.push(...apiData);
          loading.value = false;
        }
      }
    };
  },
  components: { AddressLink, LongString }
})
</script>

<style lang="sass">

.chip-placing
  margin-left: -10px
</style>
