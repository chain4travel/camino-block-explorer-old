<template>
  <q-page padding>
    <!-- content -->
    <div class="row q-mt-xl">
      <div class="offset-2 col-8">
        <details-table :columns="columns" title="C-Blocks" :store="store" @row-clicked="(item) => rowEvent(item)">
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
import { getAllBlocksPath, getBlockDetailsPath } from 'src/utils/route-utils';
import { ChainType } from 'src/types/chain-type';

const columns = [
  {
    name: 'block',
    label: 'Block',
    field: 'height'
  },
  {
    name: 'age',
    label: 'Age',
    field: (row: BlockTableData) => getRelativeTime(row.timestamp),
  },
  {
    name: 'transactions',
    label: '# of tx',
    field: 'numberOfTransactions'
  },
  {
    name: 'hash',
    label: 'Hash',
    field: 'hash'
  },
  {
    name: 'gasUsed',
    label: 'Gas Used',
    field: 'gasUsed'
  },
  {
    name: 'gasLimit',
    label: 'Gas Limit',
    field: 'gasLimit'
  }
]
export default defineComponent({
  name: 'CChainBlocksAll',
  components: { DetailsTable },
  async setup() {
    const router = useRouter();

    return {
      store: useCIndexStore(),
      columns,
      rowEvent(item: BlockTableData) {
        console.log(item);
        router.push({ path: getBlockDetailsPath(ChainType.C_CHAIN, item.hash), query: { back: getAllBlocksPath(ChainType.C_CHAIN) } })
      }

    }
  }
})
</script>
