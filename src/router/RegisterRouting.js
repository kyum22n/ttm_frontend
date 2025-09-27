const routes = [
  {
    path: "/Register/Pet",
    component: () => import(/*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterPet"),
  },
  {
    path: "/Register/User",
    component: () => import(/*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterUser"),
  },
];

export default routes;
