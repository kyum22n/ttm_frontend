import { createRouter, createWebHistory } from "vue-router";
import AuthRouting from "./AuthRouting";
import RegisterRouting from "./RegisterRouting";
import PostRouting from "./PostRouting";
import ProfileRouting from "./ProfileRouting";
import WalkRouting from "./WalkRouting";
import MessageRouting from "./MessageRouting";

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
    meta: { hideLayout: true }
  },

  {
  path: '/Message/Detail',
  name: 'MessageDetail',
  component: () => import('@/views/Message/MessageDetail/index.vue'),
  },

  {
  path: '/Message/Pending',
  name: 'MessagePending',
  component: () => import('@/views/Message/Pending.vue'),
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
