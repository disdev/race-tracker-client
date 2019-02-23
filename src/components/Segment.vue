<template>
  <b-container>
    <div class="col-sm-12" v-if="segment">
      <h2>{{ segment.name }}</h2>
      <h4>{{ race.name }} Course</h4>
      <div>
        {{ segment.fromCheckpoint.name }} ({{ segment.totalDistance - segment.distance}} miles) to {{ segment.toCheckpoint.name }} ({{ segment.totalDistance }} miles)
      </div>
      <div style="margin-top: 20px;">
        <b-table responsive hover :fields="fields" :items="rowData" style="width: 100%">
          <template slot="participant.fullName" slot-scope="data">
            <router-link :to="{ name: 'participant', params: { id: data.item.participant.bib }}">{{ data.item.participant.fullName }} - #{{ data.item.participant.bib }}</router-link>
          </template>
        </b-table>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';

@Component
export default class Segment extends Vue {
  @Getter('getSegmentById') private getSegmentById: any;
  @Getter('getRaceById') private getRaceById: any;
  @Getter('getLeadersByRaceId') private getLeadersByRaceId: any;

  private fields: any = [
    { label: 'Place', key: 'place' },
    { label: 'Name', key: 'participant.fullName' },
    { label: 'When', key: 'when', formatter: 'timeFormatter' },
    { label: 'Time', key: 'segmentTime'},
    { label: 'Pace', key: 'segmentPace'},
  ];

  get rowData() {
    const out: any = [];
    let place: number = 1;
    let previous = null;
    const thisSegment = this.segment;

    if (this.segment) {
      this.leaders.forEach((leader: any) => {
        if (thisSegment.order === 1) {
          previous = moment(this.race.start + 'Z');
        } else {
          previous = moment(leader.checkins[thisSegment.order - 1]);
        }

        leader.place = place;
        leader.thisCheckin = leader.checkins[thisSegment.order];
        leader.segmentCheckinTime = leader.checkins[thisSegment.order] ?
          moment(leader.checkins[thisSegment.order]).format('ddd, LT') : '';
        leader.segmentTime = leader.checkins[thisSegment.order] ?
          this.timeDifference(previous, moment(leader.checkins[thisSegment.order])) : '';
        leader.segmentPace = this.calculatePace(
          moment.duration(moment(leader.checkins[thisSegment.order]).diff(previous)).asSeconds(),
          thisSegment.distance);

        out.push(leader);
        place++;
      });
    }

    out.sort((first: any, second: any) => {
      const firstTime = moment(first.thisCheckin);
      const secondTime = moment(second.thisCheckin);

      if (firstTime.isBefore(secondTime)) {
        return -1;
      }

      if (firstTime.isAfter(secondTime)) {
        return 1;
      }

      return 0;
    });

    return out;
  }

  private timeDifference(from: any, to: any) {
    return this.formatTimeFromSeconds(moment.duration(to.diff(from)).asSeconds());
  }

  private calculatePace(seconds: number, distance: number) {
    return this.formatTimeFromSeconds(Math.floor(seconds / distance));
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
