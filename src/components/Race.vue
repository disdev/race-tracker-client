<template>
  <div class="col-sm-12" v-if="race">
    <h4>{{ race.name }}</h4>
    <p>
      <router-link :to="{ name: 'course', params: { code: race.code }}">Course</router-link> | 
      <router-link :to="{ name: 'checkins', params: { code: race.code }}">Checkins</router-link>
    </p>
    <b-table responsive striped :fields="fields" :items="rowData" style="width: 100%">
      <template slot="place" slot-scope="data">
        {{ data.index + 1 }}
      </template>
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

    this.leaders.forEach((leader: any) => {
      const row = {
        name: leader.participant.fullName,
        bib: leader.participant.bib,
        ...leader.checkins,
      };

      data.push(row);
    });

    return data;
  }

  get race() {
    return this.getRaceByCode(this.$route.params.code);
  }

  get segments() {
    return this.getSegmentsByRaceId(this.race.id);
  }

  private timeFormatter(value: any, key: any, item: any) {
    return value ? moment(value).format('LT') : '';
  }

  private participantLinkFormatter(value: any, key: any, item: any) {
    return item;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
