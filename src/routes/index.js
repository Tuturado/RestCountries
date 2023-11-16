import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import Details from '../views/Details.vue';

const routes = [
  { path: '/', component: Home, name:'home' },
  { path: '/details/:countryCode', component: Details , name:'details', props: true},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;