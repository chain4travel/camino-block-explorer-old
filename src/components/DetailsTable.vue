<template>
  <div class="q-pa-md">
    <q-table class="my-sticky-dynamic" :title="title" :rows="data" :columns="columns" :loading="loading" row-key="index"
      virtual-scroll :virtual-scroll-item-size="48" :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]"
      @virtual-scroll="onScroll" @row-click="(event, item) => $emit('row-clicked', item)">
      <template v-slot:top-right>
        <q-btn color="primary" icon="mdi-refresh" @click="() => refresh()" />
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue';
import { BlockTableData, Block } from 'src/types/block';
import { ChainViewLoader } from 'src/types/chain-view-loader';

const pageSize = 10;


function mapToTableData(block: Block): BlockTableData {
  return {
    id: block.id,
    height: block.height,
    gasLimit: block.gasLimit,
    gasUsed: block.gasUsed,
    hash: block.hash,
    numberOfTransactions: block.transactions ? block.transactions.length : 0,
    timestamp: block.timestamp
  }
}
export default defineComponent({
  name: 'DetailsTable',
  props: {
    store: { type: Object as PropType<ChainViewLoader>, required: true },
    title: { type: String, required: true },
    columns: { type: Array, required: true }
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
        console.log('refreshing')
        loading.value = true;
        currentOffset.value = 0;
        const apiData = await props.store.loadLatestBlocks(true, currentOffset.value, pageSize);
        const newData: BlockTableData[] = []
        knownHashes = [];
        apiData.map(mapToTableData).forEach(newBlock => {
          if (!knownHashes.includes(newBlock.hash)) {
            knownHashes.push(newBlock.hash);
            newData.push(newBlock);
          }
        })
        data.value = newData
        loading.value = false
      },
      async onScroll({ to }: { to: number }) {
        const lastIndex = data.value.length - 1;
        if (data.value && data.value.length) {
          console.log(data.value[data.value.length - 1].height)
        }


        if (loading.value !== true && to === lastIndex && (data.value.length === 0 || data.value.every(e => e.height > 1))) {
          loading.value = true;
          console.log('calling: ', currentOffset.value);
          const apiData = await props.store.loadLatestBlocks(true, currentOffset.value, pageSize);
          currentOffset.value += apiData.length;
          console.log('api data', apiData);
          apiData.map(mapToTableData).forEach(newBlock => {
            if (!knownHashes.includes(newBlock.hash)) {
              data.value.push(newBlock);
              knownHashes.push(newBlock.hash);
            }
          })
          loading.value = false;
        }


      }

    }
  }
})
</script>

<style scoped lang="sass">
*
  background: #27324C
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
