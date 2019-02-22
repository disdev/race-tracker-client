<template>
  <b-container v-if="race">
    <b-row>
      <b-col sm="12">
        <h4>{{ race.name }}</h4>
        <b-table small hover :fields="fields" :items="segments">
          <template slot="name" slot-scope="data">
            <router-link :to="{ name: 'segment', params: { id: data.item.id }}">{{ data.item.name }}</router-link>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

@Component
export default class Course extends Vue {
  @Getter('getRaceByCode') private getRaceByCode: any;
  @Getter('getSegmentsByRaceId') private getSegmentsByRaceId: any;

  get race() {
    return this.getRaceByCode(this.$route.params.code);
  }

  get segments() {
    return this.getSegmentsByRaceId(this.race.id);
  }

  private fields: any = [
    { label: 'Order', key: 'order' },
    { label: 'Name', key: 'name' },
    { label: 'Distance', key: 'distance' },
    { label: 'Total Distance', key: 'totalDistance' },
  ];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
