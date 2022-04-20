<template>
  <q-page class="flex">
    <q-card class="headline-card text-white text-center">
      <q-card-section>
        <div class="text-h2">Explore the true potential of travel.</div>
      </q-card-section>
      <q-card-section class="container">
        <div class="row">
          <q-input label="Search by Address / Hash /Block / Token" rounded class="col-6 offset-3" dark outlined
            v-model="searchInput" clearable>
            <template v-slot:prepend>
              <q-avatar size="lg" color="dark" text-color="white" icon="search">
              </q-avatar>
            </template>
            <template v-slot:append>
              <q-avatar size="lg" class="append-icon" icon="mdi-arrow-right">
              </q-avatar>
            </template>

          </q-input>
        </div>

      </q-card-section>
    </q-card>
    <div class="row full-width q-mr-xl">
      <div class="offset-1 col-5">
        <!-- Latest Blocks-->
        <list-card title="Latest Blocks" :items="blocks">
          <template v-slot="{ item }">
            <div class="col-1">
              <q-icon class="icon-background" size="sm" name="mdi-cube-outline" />
            </div>
            <div class="col-6">
              <div>
                {{ item.height }}</div>
              <div>
                {{ getRelativeTime(item.timestamp) + " ago" }}
              </div>
            </div>
            <div class="col-3">
              {{ item.transactions }}<br>
              {{ item.hash.substring(0, 12) + "..." }}
            </div>
            <div class="col-2 burn-icon">
              <q-icon class="text-red" size="sm" name="mdi-fire" />
              {{ item.burned }} CAM
            </div>
          </template>
        </list-card>
      </div>
      <!-- Latest Transactions-->
      <div class="col-5 q-ml-xl">
        <list-card title="Latest Transactions" :items="transactions">
          <template v-slot="{ item }">
            <div class="col-1">
              <q-icon class="icon-background" size="sm" name="mdi-transfer" />
            </div>
            <div class="col-6">
              <div>
                {{ item.hash.substring(0, 12) + "..." }}</div>
              <div>
                {{ getRelativeTime(item.timestamp) + " ago" }}
              </div>
            </div>
            <div class="col-3">
              <div class="row">
                <div class="col-3">From </div>
                <div class="col-9">{{ item.from }}</div>
              </div>
              <div class="row">
                <div class="col-3">To </div>
                <div class="col-9">{{ item.to }}</div>
              </div>
            </div>
            <div class="col-2 gas-used">
              <q-icon class="text-red" size="sm" name="mdi-fire" />
              {{ item.gasUsed }} CAM
            </div>
          </template>
        </list-card>
      </div>


    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import ListCard from 'src/components/ListCard.vue';
import { Duration } from 'luxon'
import { useCIndexStore } from 'src/stores/c-index-store'
let searchInput: Ref<string> = ref('');

function getRelativeTime(timestamp: Date) {
  console.log('date', timestamp)
  const duration = Duration.fromMillis(new Date().getTime() - timestamp.getTime()).shiftTo('seconds');
  console.log('duration', duration.toHuman())
  if (duration.seconds < 1) {
    return 'less than one second'
  } else if (duration.seconds < 60) {
    return duration.toHuman({ maximumFractionDigits: 0 });
  } else {
    return duration.shiftTo('minutes').toHuman({ maximumFractionDigits: 0 })
  }
}


function createMockTransactions() {
  const olderTimstamp = new Date();
  olderTimstamp.setMinutes(olderTimstamp.getMinutes() - 1);
  console.log('olderTimestamp', olderTimstamp)
  return [{
    from: '1',
    to: '123456',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    gasUsed: 11234556,
    timestamp: olderTimstamp,
    burned: 0.27,
  },
  {
    from: '12341223',
    to: '123456',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    gasUsed: 11234556,
    timestamp: new Date(),
    burned: 0.27,
  }, {
    from: '12341223',
    to: '123456',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    gasUsed: 11234556,
    timestamp: new Date(),
    burned: 0.27,
  }, {
    from: '12341223',
    to: '123456',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    gasUsed: 11234556,
    timestamp: new Date(),
    burned: 0.27,
  }, {
    from: '12341223',
    to: '123456',
    hash: '0xeca18bc16551031a2a7032b2a0ea8e22977415adc0732012f2188e7dd083f1a3',
    gasUsed: 11234556,
    timestamp: new Date(),
    burned: 0.27,
  },]
}

export default defineComponent({
  name: 'IndexPage',
  

  async setup() {
    return {
      searchInput,
      blocks: await useCIndexStore().loadBlocks(),
      transactions: createMockTransactions(),
      getRelativeTime
    };
  },
  components: { ListCard }
})
</script>

<style lang="sass" scoped>
.headline-card
  width: 100%
  max-height: 25em
  background: linear-gradient(135deg, #149EED 10.48%, #B440FC 89.52%)
.search-input
  width: 50%
.append-icon
  color: white
  background-color: orange
.burn-icon
  background-color:  rgba(255, 53, 53, 0.15)
  border-radius: 30px
  display: flex
  align-items: center
  align-content: start
  justify-content: center
  justify-items: center
.icon-background
  background-color: #455374
  padding: 12px
  color: white
.gas-used
  background-color:  rgba(255, 255, 255, 0.15)
  border-radius: 30px
  display: flex
  align-items: center
  align-content: start
  justify-content: center
  justify-items: center
.search-icon
  background: #141A18
  border-radius: 30px
  display: flex
  align-items: center
  align-content: start
  justify-content: center
  justify-items: center
</style>
