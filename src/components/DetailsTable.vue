<template>
  <div class="q-pa-md">
    <q-table :grid="$q.screen.xs" class="my-sticky-dynamic" :title="title" :rows="data" :columns="computedColumns"
      :loading="loading" row-key="index" virtual-scroll :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]" @virtual-scroll="onScroll"
      @row-click="(event, item) => $emit('row-clicked', item)">
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <long-string :value="props.value" :max-length="50"></long-string>
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-btn rounded color="primary" icon="mdi-refresh" @click="() => refresh()" />
      </template>
      <template v-slot:bottom>
        <q-btn v-if="backAddr" rounded color="primary" size="md" icon="mdi-chevron-left" @click="() => $router.push(backAddr)" />
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue';
import { BlockTableData } from 'src/types/block';
import { ChainViewLoader } from 'src/types/chain-view-loader';
import LongString from './ui/LongString.vue';
import { computed } from '@vue/reactivity';

const pageSize = 20;

export default defineComponent({
  name: 'DetailsTable',
  props: {
    store: { type: Object as PropType<ChainViewLoader>, required: true },
    title: { type: String, required: true },
    columns: { type: Array, required: true },
    loadData: { type: Function, required: true },
    requireLoadMore: { type: Function, required: true },
    backAddr: { type: String, requried: false }
  },
  emits: ['row-clicked'],
  async setup(props) {
    console.log(props.columns)
    const computedColumns = computed(() => {
      return props.columns.map((e: { style?: string }) => {
        if (!e.style) {
          console.log('calculating width', screen.width, props.columns.length)
          e.style = 'max-width:' + (screen.availWidth / props.columns.length) + 'px;';
          console.log('result ', e.style)
        }
        return e;
      })
    })
    const loading = ref(false);
    const data: Ref<BlockTableData[]> = ref([]);
    const currentOffset = ref(0);
    let knownHashes: string[] = [];
    return {
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
          console.log('Loading');
          loading.value = true;
          const apiData = await props.loadData(props.store, knownHashes, currentOffset.value, pageSize);
          console.log('apiData', apiData);
          currentOffset.value += apiData.length || 1;
          data.value.push(...apiData);
          console.log('done');
          loading.value = false;
        }
      }
    };
  },
  components: { LongString }
})
</script>

<style scoped lang="sass">
*
  background: $background-card
  color: white
.my-sticky-dynamic
  /* height or max-height is important */
  height: 80vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #ffffff
    position: sticky
    z-index: 1

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

</style>
