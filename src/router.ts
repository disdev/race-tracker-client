import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Race from './components/Race.vue';
import Course from './components/Course.vue';
import Segment from './components/Segment.vue';
import Confirm from './components/Confirm.vue';
import Callback from './components/Callback.vue';
import Participant from './components/Participant.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/race/:code',
      name: 'race',
      component: Race,
    },
    {
      path: '/course/:code',
      name: 'course',
      component: Course,
    },
    {
      path: '/segment/:id',
      name: 'segment',
      component: Segment,
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback,
    },
    {
      path: '/participant/:id',
      name: 'participant',
      component: Participant,
    },
    {
      path: '/confirm/:code',
      name: 'confirm',
      component: Confirm,
    },
  ],
});

export default router;
