import { createRouter, createWebHistory } from "vue-router";
import AuthRouting from "./AuthRouting";
import RegisterRouting from "./RegisterRouting";
import PostRouting from "./PostRouting";
import ProfileRouting from "./ProfileRouting";
import WalkRouting from "./WalkRouting";
import MessageRouting from "./MessageRouting";

const routes = [
  // {
  //   path: "/",
  //   component: () => import(/* webpackChunkName: "home" */ "../Home.vue"),
  // },

  ...AuthRouting,
  ...RegisterRouting,
  ...PostRouting,
  ...ProfileRouting,
  ...WalkRouting,
  ...MessageRouting,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
