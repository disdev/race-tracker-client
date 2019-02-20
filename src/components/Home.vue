<template>
  <b-container fluid>
    <div class="row" style="margin-top: 20px;">
      <Leaderboard 
        v-for="race in races" 
        v-bind:key="race.id"
        v-bind:race="race"/>
    </div>
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
