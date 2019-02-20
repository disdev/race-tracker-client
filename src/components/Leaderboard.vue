<template>
  <div class="col-sm-12 col-md-6" v-if="race">
    <h4 class="text-center">{{ race.name }}</h4>
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
      key: 'participant.bib',
      label: 'Bib',
    },
    {
      key: 'participant.fullName',
      label: 'Name',
    },
    {
      key: 'lastCheckin.segment.totalDistance',
      label: 'Distance',
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
    if (item.lastCheckin) {
      if (item.lastCheckin) {
        const previous = moment(this.race.start);
        const current = moment(item.lastCheckin.when);

        return this.formatTimeFromSeconds(moment.duration(current.diff(previous)).asSeconds());
      }
    }
    return '';
  }

  private formatTimeFromSeconds(totalSeconds: number) {
    const hours = totalSeconds / (60 * 60);
    const absoluteHours = Math.floor(hours);
    const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    const minutes = (hours - absoluteHours) * 60;
    const absoluteMinutes = Math.floor(minutes);
    const m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

    const seconds = (minutes - absoluteMinutes) * 60;
    const absoluteSeconds = Math.floor(seconds);
    const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    if (absoluteHours > 0) {
      return absoluteHours + ':' + m + ':' + s;
    } else {
      return absoluteMinutes + ':' + s;
    }

  }

  private calculatePace(seconds: number, distance: number) {
    return this.formatTimeFromSeconds(Math.floor(seconds / distance));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
