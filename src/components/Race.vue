<template>
  <div class="col-sm-12" v-if="race">
    <h4>{{ race.name }}</h4>
    <p>
      <router-link :to="{ name: 'course', params: { code: race.code }}">Course</router-link>
    </p>
    <b-form-group label-cols-sm="3" label="Search" class="mb-0">
      <b-input-group>
        <b-form-input v-model="filterText" placeholder="Name" />
        <b-input-group-append>
          <b-button :disabled="!filterText" @click="filterText = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-table responsive striped :fields="fields" :items="rowData" style="width: 100%" :filter="filterText">
      <template slot="name" slot-scope="data">
        <router-link :to="{ name: 'participant', params: { id: data.item.bib }}">{{ data.item.name }}</router-link>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';

@Component
export default class Race extends Vue {
  @State('races') private races: any;

  @Getter('getLeadersByRaceCode') private getLeadersByRaceCode: any;
  @Getter('getRaceByCode') private getRaceByCode: any;
  @Getter('getSegmentsByRaceId') private getSegmentsByRaceId: any;

  private filterText: string = '';

  get fields() {
    const out = [
      {
        key: 'place',
        label: 'Place',
      },
      {
        key: 'name',
        label: 'Name',
        formatter: 'participantLinkFormatter',
      },
    ];

    this.segments.forEach((segment: any) => {
      out.push({
        key: segment.order + '',
        label: segment.totalDistance + '',
        formatter: 'timeFormatter',
      });
    });

    return out;
  }

  get leaders() {
    return this.getLeadersByRaceCode(this.$route.params.code);
  }

  get rowData() {
    const data: any = [];
    let index: number = 1;

    this.leaders.forEach((leader: any) => {
      const row = {
        name: leader.participant.fullName,
        bib: leader.participant.bib,
        place: index,
        ...leader.checkins,
      };

      data.push(row);
      index++;
    });

    return data;
  }

  get race() {
    return this.getRaceByCode(this.$route.params.code);
  }

  get segments() {
    return this.getSegmentsByRaceId(this.race.id);
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

  private timeFormatter(value: any, key: any, item: any) {
    if (value !== undefined) {
      const previous: any = this.race.start;
      const current = moment(value);
      const seconds = moment.duration(current.diff(previous)).asSeconds();

      return this.formatTimeFromSeconds(seconds);
    }

    return '';
  }

  private participantLinkFormatter(value: any, key: any, item: any) {
    return item;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
