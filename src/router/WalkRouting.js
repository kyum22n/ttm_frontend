const routes = [
  {
    path: "/Walk/List",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkList"),
  },
  {
    path: "/Walk/Request",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkRequest"),
  },
  {
    path: "/Walk/Item",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkItem"),
  },
  {
    path: "/Walk/AppItem",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkApplicantsModal/WalkApplicantItem.vue"),
  },
  {
    path: "/Walk/App",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkApplicantsModal"),
  },
  {
    path: "/Walk/",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/Walk.vue"),
  },
];

export default routes;
