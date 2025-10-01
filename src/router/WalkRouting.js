const routes = [
  {
    path: "/Walk/WalkList",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkList"),
  },
  {
    path: "/Walk/WalkRequest",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkRequest"),
  },
  {
    path: "/Walk/WalkItem",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkItem"),
  },
  {
    path: "/Walk/WalkApplicantModal/WalkApplicantItem",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkApplicantsModal/WalkApplicantItem.vue"),
  },
  {
    path: "/Walk/WalkApplicantsModal",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkApplicantsModal"),
  },
  {
    path: "/Walk/Walk",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/Walk.vue"),
  },
];

export default routes;
