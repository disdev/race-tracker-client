<template>
  <b-container fluid>
    <b-row style="margin-top: 20px;">
      <b-col cols="12" md="6" v-for="race in races" v-bind:key="race.id">
        <Leaderboard 
          v-bind:race="race"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import Leaderboard from '@/components/Leaderboard.vue';

@Component({
  components: {
    Leaderboard,
  },
})
export default class Home extends Vue {
  @State('races') private races: any;
}

</script>
