<template>
  <div class="container" v-if="leader && race">
    <div class="row">
      <div class="col-sm-9">
        <h4>
          {{ leader.participant.fullName }} - #{{ leader.participant.bib }}
          <b-badge :variant="statusClass">{{ statusText }}</b-badge>
        </h4>
        <div>
          {{ leader.participant.age }}<br/>
          {{ leader.participant.hometown }}
        </div>
      </div>
      <div class="col-sm-3">
        <b-button v-b-modal.subscribe variant="primary">Notify me</b-button>
        <b-modal id="subscribe" ref="subscribeModal" title="Subscribe to updates" @ok="handleSubscribe">
          <p>Enter your phone number below to receive updates for this runner.
            <strong>Updates will be sent regardless of the time of day.</strong> 
            You will receive a confirmation text at the number entered below.
          </p>
          <b-form-group id="subscriptionFormGroup"
                      label="Phone number:"
                      label-for="phoneNumber">
          <b-form-input id="phoneNumber"
                        type="tel"
                        v-model="subscriptionPhone"
                        required
                        placeholder="Enter phone number">
          </b-form-input>
          <div>
            <b-alert show variant="danger" v-if="errors.length">
              <span v-for="(error, index) in errors" v-bind:key="`message-${index}`">
                {{ error.message }}
              </span>
            </b-alert>
          </div>
        </b-form-group>
        </b-modal>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12" style="margin-top: 20px;">
        <b-table small hover :fields="fields" :items="rowData"></b-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';
import { Modal } from 'bootstrap-vue';

@Component
export default class Participant extends Vue {
  public $refs!: {
    subscribeModal: Modal,
  };

  @State('races') private races: any;

  @Getter('getLeaderByParticipantId') private getLeaderByParticipantId: any;
  @Getter('getRaceById') private getRaceById: any;
  @Getter('getSegmentsByRaceId') private getSegmentsByRaceId: any;

  @Action('addSubscription') private addSubscription: any;

  private subscriptionPhone: string = '';
  private errors: any = [];

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
      label: 'Check in',
      formatter: 'timeFormatter',
    },
    {
      key: 'segmentTime',
      label: 'Segment Time',
      formatter: 'segmentTimeFormatter',
    },
    {
      key: 'segmentPace',
      label: 'Segment Pace',
      formatter: 'segmentPaceFormatter',
    },
    {
      key: 'totalTime',
      label: 'Overall Time',
      formatter: 'totalTimeFormatter',
    },
    {
      key: 'totalPace',
      label: 'Overall Pace',
      formatter: 'totalPaceFormatter',
    },
  ];

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

  private segmentTimeFormatter(value: any, key: any, item: any) {
    if (item.when !== undefined) {
      let previous: any;

      if (item.order === 1) {
        previous = moment(this.race.start);
      } else {
        previous = moment(this.leader.checkins[item.order - 1]);
      }

      const current = moment(item.when);
      const seconds = moment.duration(current.diff(previous)).asSeconds();

      return this.formatTimeFromSeconds(seconds);
    }

    return '';
  }

  private segmentPaceFormatter(value: any, key: any, item: any) {
    if (item.when !== undefined) {
      let previous: any;

      if (item.order === 1) {
        previous = moment(this.race.start);
      } else {
        previous = moment(this.leader.checkins[item.order - 1]);
      }

      const current = moment(item.when);
      const seconds = moment.duration(current.diff(previous)).asSeconds();

      return this.calculatePace(seconds, item.distance);
    }

    return '';
  }

  private totalTimeFormatter(value: any, key: any, item: any) {
    if (item.when !== undefined) {
      const previous: any = this.race.start;
      const current = moment(item.when);
      const seconds = moment.duration(current.diff(previous)).asSeconds();

      return this.formatTimeFromSeconds(seconds);
    }

    return '';
  }

  private totalPaceFormatter(value: any, key: any, item: any) {
    if (item.when !== undefined) {
      const previous: any = this.race.start;
      const current = moment(item.when);
      const seconds = moment.duration(current.diff(previous)).asSeconds();

      return this.calculatePace(seconds, item.totalDistance);
    }

    return '';
  }

  private async handleSubscribe(evt: any) {
    evt.preventDefault();

    this.errors = [];

    const subscriptionResult = await this.addSubscription({
      phoneNumber: this.subscriptionPhone,
      raceNumber: this.leader.participant.bib,
    });

    if (subscriptionResult === false) {
      this.errors.push({
        message: 'Whoops! Please double-check the phone number and try again.',
      });
    } else {
      this.subscriptionPhone = '';
      this.$refs.subscribeModal.hide();
    }
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

  get statusText() {
    let out: string = '';
    switch (this.leader.participant.status) {
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

  get statusClass() {
    let out: string = '';
    switch (this.leader.participant.status) {
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
