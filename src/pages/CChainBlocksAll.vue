<template>
  <div class="row q-mt-xl">
    <div class="col-12">
      <DetailsTable :back-addr="backAddr" :load-data="loadBlocks" :require-load-more="requireLoadMore"
        :columns="columns" title="C-Blocks" :store="store" @row-clicked="(item) => rowEvent(item)">
      </DetailsTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DetailsTable from 'src/components/DetailsTable.vue'
import { useCIndexStore } from 'src/stores/c-index-store';
import { getRelativeTime } from 'src/utils/display-utils';
import { BlockTableData } from 'src/types/block';
import { useRouter } from 'vue-router'
import { getAllBlocksPath, getBlockDetailsPath, getOverviewPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { ChainViewLoader } from 'src/types/chain-view-loader';

const columns = [
  {
    name: 'block',
    label: 'Block',
    field: 'number',
    align: 'left',
    width: '65'
  },
  {
    name: 'age',
    label: 'Age',
    field: (row: BlockTableData) => getRelativeTime(row.timestamp),
    align: 'left',
    width: '150'
  },
  {
    name: 'transactions',
    label: '# of tx',
    field: 'numberOfTransactions',
    align: 'left',
    width: '150'
  },
  {
    name: 'hash',
    label: 'Hash',
    field: 'hash',
    align: 'left'
  },
  {
    name: 'gasUsed',
    label: 'Gas Used',
    field: 'gasUsed',
    align: 'left',
    width: '200'
  },
  {
    name: 'gasLimit',
    label: 'Gas Limit',
    field: 'gasLimit',
    align: 'left',
    width: '200'
  }
]

export default defineComponent({
  name: 'CChainBlocksAll',
  components: { DetailsTable },
  async setup() {
    const router = useRouter();
    let moreToLoad = true;

    return {
      store: useCIndexStore(),
      columns,
      rowEvent(item: BlockTableData) {
        router.push({ path: getBlockDetailsPath(ChainType.C_CHAIN, item.number || 0), query: { back: getAllBlocksPath(ChainType.C_CHAIN) } })
      },
      async loadBlocks(store: ChainViewLoader, knownHashes: string[], offset: number, limit: number): Promise<BlockTableData[]> {
        const apiData: BlockTableData[] = await store.loadLatestBlocks(offset, limit);
        const newData: BlockTableData[] = []
        moreToLoad = false;
        apiData.forEach(newBlock => {
          if (!knownHashes.includes(newBlock.hash)) {
            knownHashes.push(newBlock.hash);
            newData.push(newBlock);
            moreToLoad = true;
          }
        })
        return newData;
      },
      requireLoadMore(): boolean {
        return moreToLoad;
      },
      backAddr: getOverviewPath(ChainType.C_CHAIN)
    }
  }
})
</script>
