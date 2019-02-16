<template>
  <div class="col-sm-12 col-md-6" v-if="race">
    <h4>{{ race.name }}</h4>
    <b-table striped :fields="fields" :items="leaders">
      <template slot="place" slot-scope="data">
        {{ data.index + 1 }}
      </template>
      <template slot="participant.fullName" slot-scope="data">
        <router-link :to="{ name: 'participant', params: { id: data.item.participant.bib }}">{{ data.item.participant.fullName }}</router-link>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';

@Component
export default class Leaderboard extends Vue {
  @Prop() public race!: any;

  @Getter('getLeadersByRaceId') private getLeadersByRaceId: any;

  private fields: any = [
    {
      key: 'place',
      label: 'Place',
    },
    {
      key: 'participant.fullName',
      label: 'Name',
    },
    {
      key: 'lastCheckin.segment.totalDistance',
      label: 'Total Distance',
    },
    {
      key: 'elapsedTime',
      label: 'Time',
      formatter: 'timeFormatter',
    },
  ];

  get leaders() {
    return this.getLeadersByRaceId(this.race.id);
  }

  private timeFormatter(value: any, key: any, item: any) {
    return item.lastCheckin ? moment(item.lastCheckin.when).format('ddd, LT') : '';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
