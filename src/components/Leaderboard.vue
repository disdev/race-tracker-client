<template>
  <b-row>
    <b-col cols="12">
      <router-link :to="{ name: 'race', params: { code: race.code }}">
        <h4 class="text-center">
          {{ race.name }} Leaderboard
        </h4>
      </router-link>
    </b-col>
    <b-col cols="12" style="margin-bottom: 8px;">
      <b-form-group label-cols-sm="3" label="Search" class="mb-0">
        <b-input-group>
          <b-form-input size="small" v-model="filterText" placeholder="Name" />
          <b-input-group-append>
            <b-button variant="primary" :disabled="!filterText" @click="filterText = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-col>
    <b-col>
      <b-table responsive small hover :fields="fields" :items="leaders" :filter="filterText">
        <template slot="displayName" slot-scope="data">
          <router-link :to="{ name: 'participant', params: { id: data.item.participant.bib }}">
            {{ data.item.displayName }}
          </router-link>&nbsp;
          <b-badge :variant="statusClass(data.item.participant.status)">{{ statusText(data.item.participant.status) }}</b-badge>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';

@Component
export default class Leaderboard extends Vue {
  @Prop() public race!: any;

  @Getter('getLeadersByRaceId') private getLeadersByRaceId: any;

  private filterText: string = '';
  private fields: any = [
    {
      key: 'place',
      label: 'Place',
    },
    {
      key: 'displayName',
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
    const leaders: any = [];
    let place = 1;
    this.getLeadersByRaceId(this.race.id).forEach((leader: any) => {
      leader.place = place;
      leader.displayName = leader.participant.fullName + ' - #' + leader.participant.bib;
      leaders.push(leader);
      place++;
    });
    return leaders;
  }

  private statusText(status: number) {
    let out: string = '';
    switch (status) {
      case 0:
        out = 'Registered';
        break;
      case 1:
        out = 'DNS';
        break;
      case 2:
        out = 'On Course';
        break;
      case 3:
        out = 'DNF';
        break;
      case 4:
        out = 'Finished';
        break;
      default:
        break;
    }

    return out;
  }

  private statusClass(status: number) {
    let out: string = '';
    switch (status) {
      case 0:
        out = 'secondary';
        break;
      case 1:
        out = 'warning';
        break;
      case 2:
        out = 'primary';
        break;
      case 3:
        out = 'danger';
        break;
      case 4:
        out = 'success';
        break;
      default:
        break;
    }

    return out;
  }

  private timeFormatter(value: any, key: any, item: any) {
    if (item.lastCheckin) {
      if (item.lastCheckin) {
        const previous = moment(this.race.start + 'Z');
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
