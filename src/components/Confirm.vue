<template>
  <b-container v-if="race && pendingCheckins">
    <b-row>
      <b-col cols="12">
        <h4>Pending Checkins for {{ race.name }}</h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <Checkin
          v-for="checkin in pendingCheckins" 
          v-bind:key="checkin.id"
          v-bind:race="race"
          v-bind:checkin="checkin"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import moment from 'moment';
import Checkin from '@/components/Checkin.vue';

@Component({
  components: {
    Checkin,
  },
})
export default class Confirm extends Vue {
  @Getter('getPendingCheckinsByRaceCode') private getPendingCheckinsByRaceCode: any;
  @Getter('getRaceByCode') private getRaceByCode: any;

  @Action('loadPendingCheckins') private loadPendingCheckins: any;

  get pendingCheckins() {
    return this.getPendingCheckinsByRaceCode(this.$route.params.code);
  }

  get race() {
    return this.getRaceByCode(this.$route.params.code);
  }

  private created() {
    this.loadPendingCheckins();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
