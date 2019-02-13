<template>
  <div class="col-sm-12" v-if="race">
    <h4>{{ race.name }}</h4>
    <b-table striped :fields="fields" :items="segments">
      <span slot="name" slot-scope="data" v-html="data.value"></span>
    </b-table>
  </div>
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
    { label: 'Name', key: 'name', formatter: 'linkFormatter' },
    { label: 'Distance', key: 'distance' },
    { label: 'Total Distance', key: 'totalDistance' },
  ];

  private linkFormatter(value: any, key: any, item: any) {
    return '<a href="/segment/' + item.id + '">' + value + '</a>';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
