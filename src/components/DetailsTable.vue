<template>
  <div :class="$q.screen.lt.md ? '' : 'q-pa-md'">
    <q-table :grid="$q.screen.lt.sm" class="sticky-headers" :title="title" :rows="data" :columns="computedColumns"
      :loading="loading" row-key="index" virtual-scroll :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]" @virtual-scroll="onScroll"
      @row-click="(event, item) => $emit('row-clicked', item)">
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <long-string :value="props.value" />
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
                      <long-string :value="col.value" />
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

function calculateWidthPerColumn(columns: Array<{ width?: number }>) {
  let widthToDivide = screen.availWidth - 120;
  let columnsWithEqualWidth = columns.length;
  columns.forEach((e: { width?: number }) => {
    if (e.width) {
      widthToDivide -= e.width;
      columnsWithEqualWidth--;
    }
  })
  return widthToDivide / columnsWithEqualWidth;
}

function createFixedWidthParams(width: number) {
  return 'max-width:' + width + 'px;' +
    ' min-width:' + width + 'px;';
}

export default defineComponent({
  name: 'DetailsTable',
  props: {
    store: { type: Object as PropType<ChainViewLoader>, required: true },
    title: { type: String, required: true },
    columns: { type: Array as PropType<Array<{ style?: string, width?: number }>>, required: true },
    loadData: { type: Function, required: true },
    requireLoadMore: { type: Function, required: true },
    backAddr: { type: String, requried: false }
  },
  emits: ['row-clicked'],
  async setup(props) {
    const widthPerColumn = calculateWidthPerColumn(props.columns);
    const computedColumns = computed(() => {
      console.log('Recomputing')
      return props.columns.map((e: { style?: string, width?: number }) => {
        console.log('e', e);
        console.log('width', e.width);
        if (!e.style) {
          if (e.width) {
            e.style = createFixedWidthParams(e.width);
          } else {
            e.style = createFixedWidthParams(widthPerColumn)
          }
        }
        return e;
      })
    })
    const loading = ref(false);

    let knownHashes: string[] = [];
    const initData: BlockTableData[] = await props.loadData(props.store, knownHashes, 0, pageSize);
    const data: Ref<BlockTableData[]> = ref(initData);
    const currentOffset = ref(initData.length);

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
          loading.value = true;
          const apiData = await props.loadData(props.store, knownHashes, currentOffset.value, pageSize);
          currentOffset.value += apiData.length || 1;
          data.value.push(...apiData);
          loading.value = false;
        }
      }
    };
  },
  components: { LongString }
})
</script>

<style lang="sass">
.q-table__grid-item-row
  width: 100%
</style>
