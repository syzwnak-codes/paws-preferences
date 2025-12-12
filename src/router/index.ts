import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Summary from "../components/Summary.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/summary", name: "Summary", component: Summary },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
