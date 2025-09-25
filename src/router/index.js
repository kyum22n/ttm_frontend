import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthRouting from './AuthRouting'
import RegisterRouting from './RegisterRouting'
import PostRouting from './PostRouting'
import ProfileRouting from './ProfileRouting'
import WalkRouting from './WalkRouting'
import MessageRouting from './MessageRouting'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  ...AuthRouting,
	...RegisterRouting,
	...PostRouting,
	...ProfileRouting,
	...WalkRouting,
	...MessageRouting
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
