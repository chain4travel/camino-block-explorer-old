<template>
  <q-page padding>
    <!-- content -->
    <div class="row q-mt-xl">
      <div class="offset-1 col-10">
        <details-table :back-addr="backAddr" :load-data="loadBlocks" :require-load-more="requireLoadMore" :columns="columns" title="C-Blocks" :store="store" @row-clicked="(item) => rowEvent(item)">
        </details-table>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DetailsTable from 'src/components/DetailsTable.vue'
import { useCIndexStore } from 'src/stores/c-index-store';
import { getRelativeTime } from 'src/utils/display-utils';
import { BlockTableData } from 'src/types/block';
import { useRouter } from 'vue-router'
import { getAllBlocksPath, getBlockDetailsPath, getBasePath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';
import { ChainViewLoader } from 'src/types/chain-view-loader';

const columns = [
  {
    name: 'block',
    label: 'Block',
    field: 'number',
    align: 'left'
  },
  {
    name: 'age',
    label: 'Age',
    field: (row: BlockTableData) => getRelativeTime(row.timestamp),
    align: 'left'
  },
  {
    name: 'transactions',
    label: '# of tx',
    field: 'numberOfTransactions',
    align: 'left'
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
    align: 'left'
  },
  {
    name: 'gasLimit',
    label: 'Gas Limit',
    field: 'gasLimit',
    align: 'left'
  }
]

async function loadBlocks(store: ChainViewLoader, knownHashes: string[], offset: number, limit: number): Promise<BlockTableData[]> {
  console.log('loading data', knownHashes, offset,limit)
  const apiData : BlockTableData[] = await store.loadLatestBlocks(offset, limit);
  const newData: BlockTableData[] = []
  apiData.forEach(newBlock => {
    if (!knownHashes.includes(newBlock.hash)) {
      knownHashes.push(newBlock.hash);
      newData.push(newBlock);
    }
  })
  return newData;
}


function requireLoadMore(data: BlockTableData[]): boolean {
  console.log('Require more', data.length === 0 || data.every(e => e.number > 1))
  return data.length === 0 || data.every(e => e.number > 1)
}

export default defineComponent({
  name: 'CChainBlocksAll',
  components: { DetailsTable },
  async setup() {
    const router = useRouter();

    return {
      store: useCIndexStore(),
      columns,
      rowEvent(item: BlockTableData) {
        router.push({ path: getBlockDetailsPath(ChainType.C_CHAIN, item.hash), query: { back: getAllBlocksPath(ChainType.C_CHAIN) } })
      },
      loadBlocks,
      requireLoadMore,
      backAddr: getBasePath(ChainType.C_CHAIN)
    }
  }
})
</script>
