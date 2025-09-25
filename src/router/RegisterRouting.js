const routes = [
  {
    path: "/Register/Pet",
    component: () => import(/*webpackChunkName: "AuthRouting"*/ "@/views/Register/RegisterPet"),
  },
  {
    path: "/Register/User",
    component: () => import(/*webpackChunkName: "AuthRouting"*/ "@/views/Register/RegisterUser"),
  },
];

export default routes;
