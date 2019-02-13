<template>
  <div class="col-sm-12 col-md-6">
    <h2>{{ segment.name }}</h2>
    <h4>{{ race.name }} Course</h4>
    <div>
      {{ segment.fromCheckpoint.name }} ({{ segment.totalDistance - segment.distance}} miles) to {{ segment.toCheckpoint.name }} ({{ segment.totalDistance }} miles)
    </div>
    <div style="margin-top: 20px;">
      <b-table responsive striped :fields="fields" :items="leaders" style="width: 100%">
        <span slot="name" slot-scope="data" v-html="data.value"></span>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';

@Component
export default class Race extends Vue {
  @Getter('getSegmentById') private getSegmentById: any;
  @Getter('getRaceById') private getRaceById: any;
  @Getter('getLeadersByRaceId') private getLeadersByRaceId: any;

  private fields: any = [
    { label: 'Name', key: 'name', formatter: 'participantLinkFormatter' },
    { label: 'When', key: 'when', formatter: 'timeFormatter' },
  ];

  private participantLinkFormatter(value: any, key: any, item: any) {
    return '<a href="/participant/' + item.participant.bib + '">' + item.participant.fullName + '</a>';
  }

  private timeFormatter(value: any, key: any, item: any) {
    return item.checkins[this.segment.order] ? moment(item.checkins[this.segment.order]).format('ddd, LT') : '';
  }

  get segment() {
    return this.getSegmentById(this.$route.params.id);
  }

  get race() {
    return this.getRaceById(this.segment.raceId);
  }

  get leaders() {
    return this.getLeadersByRaceId(this.race.id);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
