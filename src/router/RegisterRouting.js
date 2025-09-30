const routes = [
  {
    path: "/Register/Pet",
    component: () => import(/*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterPet"),
    meta:{hideLayout:true}
  },
  {
    path: "/Register/User",
    component: () => import(/*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterUser"),
    meta:{hideLayout:true}
  },
];

export default routes;
