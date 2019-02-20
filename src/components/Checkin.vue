<template>
  <div class="col-sm-12 col-md-6" v-if="checkin">
    <b-card class="mb-2">
      <b-card-body>
        <h2>{{ checkin.participant.bib }} - {{ checkin.participant.fullName }}</h2>
        <div>
          Completed {{ checkin.segment.name }} at {{ checkin.when }}
        </div>
        <div style="margin-top: 20px;">
          <b-form-group id="checkinSegment" label="Segment completed:" label-for="checkinSegment">
            <b-form-select id="checkinSegment" :options="segmentOptions" v-model="segmentId" required />
          </b-form-group>
          <b-button @click="onConfirm" variant="primary">Confirm</b-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';

@Component
export default class Checkin extends Vue {
  @Prop() public checkin!: any;
  @Prop() public race!: any;
  @Action('confirmCheckin') private confirmCheckin: any;
  @Getter('getSegmentsByRaceCode') private getSegmentsByRaceCode: any;

  private segmentId: string = '';

  private async onConfirm() {
    console.log('onConfirm', this.checkin.id, this.segmentId);
    const confirmResult = await this.confirmCheckin({
      checkinId: this.checkin.id,
      segmentId: this.segmentId,
    });

    if (confirmResult === false) {
      alert('Whoops! Something went wrong with that checkin.');
    }
  }

  get segmentOptions() {
    const out: any = [];
    this.segments.forEach((segment: any) => {
      out.push({
        value: segment.id,
        text: segment.name,
      });
    });
    return out;
  }

  get segments() {
    return this.getSegmentsByRaceCode(this.$route.params.code);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
