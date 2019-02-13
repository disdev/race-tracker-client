<template>
  <div class="col-sm-12" v-if="leader && race">
    <h4>{{ leader.participant.fullName }} - #{{ leader.participant.bib }}</h4>
    <div>
      {{ leader.participant.age }} - {{ gender(leader.participant.gender) }} <br/>
      {{ leader.participant.hometown }}
    </div>
    <div>
      <b-button v-b-modal.subscribe variant="primary">Notify me</b-button>
      <b-modal id="subscribe" title="Subscribe to updates" @ok="handleSubscribe">
        <p>Enter your phone number below to receive updates for this runner.
          <strong>Updates will be sent regardless of the time of day.</strong> 
          You will receive a confirmation text at the number entered below.
        </p>
        <p></p>
        <b-form-group id="subscriptionFormGroup"
                    label="Phone number:"
                    label-for="phoneNumber">
        <b-form-input id="phoneNumber"
                      type="tel"
                      v-model="subscriptionPhone"
                      required
                      placeholder="Enter phone number">
        </b-form-input>
      </b-form-group>
      </b-modal>
    </div>
    <div style="margin-top: 20px;">
      <b-table striped :fields="fields" :items="rowData"></b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';

@Component
export default class Participant extends Vue {
  @State('races') private races: any;

  @Getter('getLeaderByParticipantId') private getLeaderByParticipantId: any;
  @Getter('getRaceById') private getRaceById: any;
  @Getter('getSegmentsByRaceId') private getSegmentsByRaceId: any;

  @Action('addSubscription') private addSubscription: any;

  private subscriptionPhone: string = '';

  private fields: any = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'distance',
      label: 'Distance',
    },
    {
      key: 'totalDistance',
      label: 'Total',
    },
    {
      key: 'when',
      label: 'Time',
      formatter: 'timeFormatter',
    },
  ];

  private handleSubscribe() {
    console.log('adding subscription for ' + this.subscriptionPhone + ' for bib ' + this.leader.participant.bib);
    const subscriptionResult = this.addSubscription({ phoneNumber: this.subscriptionPhone, raceNumber: this.leader.participant.bib });
  }

  get rowData() {
    const out: any = [];

    this.segments.forEach((segment: any) => {
      out.push({
        ...segment,
        when: this.leader.checkins[segment.order],
      });
    });

    return out;
  }

  get leader() {
    return this.getLeaderByParticipantId(this.$route.params.id);
  }

  get race() {
    return this.getRaceById(this.leader.participant.raceId);
  }

  get segments() {
    return this.getSegmentsByRaceId(this.race.id);
  }

  private timeFormatter(value: any, key: any, item: any) {
    return value ? moment(value).format('ddd, LT') : '';
  }

  private gender(value: number) {
    return value === 1 ? 'Male' : 'Female';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
