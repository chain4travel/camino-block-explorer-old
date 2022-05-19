<template>
  <div class="row q-mt-xl">
    <div class="col-12">
      <DetailsTable :back-addr="backAddr" :load-data="loadBlocks" :require-load-more="requireLoadMore"
        :columns="columns" title="C-Blocks" :store="store" :details-link="detailsLink">
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
import { ChainLoader } from 'src/types/chain-loader';
import { getDisplayValue } from 'src/utils/currency-utils';


export default defineComponent({
  name: 'CChainBlocksAll',
  components: { DetailsTable },
  async setup() {
    let moreToLoad = true;

    function detailsLink(blockNumber: string) {
      return `${getBlockDetailsPath(ChainType.C_CHAIN, blockNumber || 0)}?back=${getAllBlocksPath(ChainType.C_CHAIN)}`
    }

    return {
      store: useCIndexStore(),
      async loadBlocks(store: ChainLoader, knownHashes: string[], offset: number, limit: number): Promise<BlockTableData[]> {
        const apiData: BlockTableData[] = await store.loadBlocks(offset, limit);
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
      backAddr: getOverviewPath(ChainType.C_CHAIN),
      columns: [
        {
          name: 'block',
          label: 'Block',
          field: 'number',
          align: 'left',
          type: 'hash',
          detailsLink: detailsLink
        },
        {
          name: 'age',
          label: 'Age',
          field: (row: BlockTableData) => getRelativeTime(row.timestamp) + ' ago',
          align: 'left',
        },
        {
          name: 'transactions',
          label: '# of tx',
          field: 'numberOfTransactions',
          align: 'left',
        },
        {
          name: 'hash',
          label: 'Hash',
          field: 'hash',
          align: 'left',
          type: 'hash'
        },
        {
          name: 'gasUsed',
          label: 'Gas Used',
          field: (row) => getDisplayValue(row.gasUsed),
          align: 'left',
          type: 'currency'
        },
        {
          name: 'gasLimit',
          label: 'Gas Limit',
          field: (row) => getDisplayValue(row.gasLimit),
          align: 'left',
          type: 'currency'
        }
      ]
    }
  }
})
</script>
