<template>
  <div class="col-sm-12" v-if="race && pendingCheckins">
    <h4>Pending Checkins for {{ race.name }}</h4>
    <b-card v-for="checkin in pendingCheckins" v-bind:key="checkin.id"  
        :title="checkin.participant.fullName"
        tag="checkin"
        class="mb-2">
      <p class="card-text">
        Completed {{ checkin.segment.name }} at {{ checkin.when }}
      </p>
      <b-button variant="primary">Confirm</b-button>&nbsp;
      <b-button variant="danger">Delete</b-button>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

@Component
export default class Checkins extends Vue {
  @Getter('getPendingCheckinsByRaceId') private getPendingCheckinsByRaceId: any;
  @Getter('getRaceByCode') private getRaceByCode: any;

  @Action('loadPendingCheckins') private loadPendingCheckins: any;

  private columnDefs: any;

  get pendingCheckins() {
    return this.getPendingCheckinsByRaceId(this.race.id);
  }

  get race() {
    return this.getRaceByCode(this.$route.params.code);
  }

  private beforeMount() {
    setInterval(this.loadPendingCheckins(), 15000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
