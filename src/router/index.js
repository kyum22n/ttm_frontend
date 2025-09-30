import { createRouter, createWebHistory } from "vue-router";
import AuthRouting from "./AuthRouting";
import RegisterRouting from "./RegisterRouting";
import PostRouting from "./PostRouting";
import ProfileRouting from "./ProfileRouting";
import WalkRouting from "./WalkRouting";
import MessageRouting from "./MessageRouting";
import TestView from "@/views/TestView.vue";

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
  },

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
