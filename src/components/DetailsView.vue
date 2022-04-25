<template>
  <q-card>
    <q-card-section v-if="title">
      <div class="row">
        <div class="text-subtitle1 col-11">{{ title }}</div>
      </div>
    </q-card-section>
    <q-card-section class="container">
      <q-list bordered separator>
        <q-item :key="key" v-for="[key, value] of Object.entries(content)" v-ripple clickable class="hover-effect">
          <q-item-section>
            {{ key }}
          </q-item-section>
          <q-item-section>
            <LongString v-if="value" :value="value" :max-length="64"></LongString>
            <div v-else>{{ "" }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions v-if="backRoute">
      <q-btn color="primary" :to="backRoute">Back</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import LongString from './ui/LongString.vue'
export default defineComponent({
  name: 'TransactionDetails',
  props: {
    title: { type: String as PropType<string>, required: false },
    backRoute: { type: String as PropType<string>, required: false },
    content: { type: Object as PropType<object>, required: true }
  },
  setup(props) {
    console.log(Object.entries(props.content));
    return {};
  },
  components: { LongString }
})
</script>

<style scoped lang="sass">
*
  background: #27324C
  color: white
// .hover-effect:hover
//   background-color: yellow
</style>
