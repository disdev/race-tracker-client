import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const api = axios.create({
  baseURL: process.env.VUE_APP_TRACKER_SERVICE_URL,
});

/*
subscribe({ commit }, phone: string, id: string) {
  commit('incrementLoadingCount');
  api.post('/subscribe', null, { params: { phoneNumber: phone, bib: id }})
    .then((response: any) => {
      commit('decrementLoadingCount');
    });
},*/

export default new Vuex.Store({
  state: {
    races: [],
    leaders: [],
    segments: [],
    pendingCheckins: [],
    loadingCount: 0,
  },
  mutations: {
    incrementLoadingCount(state) {
      state.loadingCount++;
    },
    decrementLoadingCount(state) {
      setTimeout(() => { state.loadingCount--; }, 1000);
    },
    setRaces(state, getRacesResponse) {
      state.races = getRacesResponse;
    },
    setLeaders(state, getLeadersResponse) {
      state.leaders = getLeadersResponse;
    },
    setSegments(state, getSegmentsResponse) {
      state.segments = getSegmentsResponse;
    },
    setPendingCheckins(state, getPendingCheckinsResponse) {
      state.pendingCheckins = getPendingCheckinsResponse;
    },
  },
  actions: {
    loadRaces({ commit }) {
      commit('incrementLoadingCount');
      api.get('/races')
        .then((response: any) => {
          commit('setRaces', response.data);
          commit('decrementLoadingCount');
        });
    },
    loadLeaders({ commit }) {
      commit('incrementLoadingCount');
      api.get('/leaders')
        .then((response: any) => {
          commit('setLeaders', response.data);
          commit('decrementLoadingCount');
        });
    },
    loadSegments({ commit }) {
      commit('incrementLoadingCount');
      api.get('/segments')
        .then((response: any) => {
          commit('setSegments', response.data);
          commit('decrementLoadingCount');
        });
    },
    loadPendingCheckins({ commit }) {
      commit('incrementLoadingCount');
      api.get('/checkins/unconfirmed')
        .then((response: any) => {
          commit('setPendingCheckins', response.data);
          commit('decrementLoadingCount');
        });
    },
    addSubscription({ commit }, { phoneNumber, raceNumber }) {
      commit('incrementLoadingCount');
      api.post('/watchers', null, { params: { raceNumber, phoneNumber }})
        .then((response: any) => {
          commit('decrementLoadingCount');
          return true;
        })
        .catch(() => {
          commit('decrementLoadingCount');
          return false;
        });
    },
  },
  getters: {
    getLeadersByRaceId: (state) => (id: string) => {
      return state.leaders.filter((leader: any) => leader.participant.raceId === id);
    },
    getLeadersByRaceCode: (state) => (code: string) => {
      const race: any = state.races.find((x: any) => x.code === code);
      return state.leaders.filter((leader: any) => leader.participant.raceId === race!.id);
    },
    getRaceByCode: (state) => (code: string) => {
      return state.races.find((race: any) => race.code === code);
    },
    getRaceById: (state) => (raceId: string) => {
      return state.races.find((race: any) => race.id === raceId);
    },
    getSegmentsByRaceId: (state) => (raceId: string) => {
      return state.segments.filter((segment: any) => segment.raceId === raceId);
    },
    getPendingCheckinsByRaceId: (state) => (id: string) => {
      return state.pendingCheckins.filter((checkin: any) => checkin.participant.raceId === id);
    },
    getLeaderByParticipantId: (state) => (id: string) => {
      return state.leaders.find((leader: any) => leader.participant.bib === id || leader.participant.id === id);
    },
    getSegmentById: (state) => (id: string) => {
      return state.segments.find((segment: any) => segment.id === id);
    },
  },
});
