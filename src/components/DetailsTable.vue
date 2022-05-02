<template>
  <div class="q-pa-md">
    <q-table dark class="my-sticky-dynamic" :title="title" :rows="data" :columns="columns" :loading="loading" row-key="index"
      virtual-scroll :virtual-scroll-item-size="48" :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]"
      @virtual-scroll="onScroll" @row-click="(event, item) => $emit('row-clicked', item)">
      <template v-slot:top-right>
        <q-btn color="primary" icon="mdi-refresh" @click="() => refresh()" />
      </template>
      <template v-slot:bottom>
        <q-btn color="primary" icon="mdi-arrow-left" @click="() => $router.back()" />
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue';
import { BlockTableData } from 'src/types/block';
import { ChainViewLoader } from 'src/types/chain-view-loader';

const pageSize = 50;

export default defineComponent({
  name: 'DetailsTable',
  props: {
    store: { type: Object as PropType<ChainViewLoader>, required: true },
    title: { type: String, required: true },
    columns: { type: Array, required: true },
    loadData: {type: Function, required: true},
    requireLoadMore: {type: Function, required: true}
  },
  emits: ['row-clicked'],
  async setup(props) {
    const loading = ref(false)
    const data: Ref<BlockTableData[]> = ref([])
    const currentOffset = ref(0)
    let knownHashes: string[] = [];
    return {
      data: data,
      loading,
      pagination: { rowsPerPage: 0 },
      async refresh() {
        loading.value = true;
        currentOffset.value = 0;
        knownHashes = [];
        data.value = await props.loadData(props.store, knownHashes, currentOffset.value, pageSize);
        currentOffset.value += data.value.length;
        loading.value = false
      },
      async onScroll({ to }: { to: number }) {
        console.log('lastKnown', knownHashes)
        console.log('currentOffset', currentOffset.value)
        console.log('loading.value', loading.value)
        const lastIndex = data.value.length - 1;
        if (loading.value !== true && to === lastIndex && props.requireLoadMore(data.value)) {
          console.log('Loading')
          loading.value = true;
          const apiData = await props.loadData(props.store, knownHashes, currentOffset.value, pageSize)
          console.log('apiData', apiData)
          currentOffset.value += apiData.length || 1;
          data.value.push(...apiData);
          console.log('done')
          loading.value = false;
        }
      }
    }
  }
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
