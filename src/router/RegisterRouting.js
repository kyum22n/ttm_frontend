const routes = [
  {
    path: "/Register/Pet",
    name: "PetRegister",
    component: () => import(/*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterPet"),
    meta:{hideLayout:true}
  },
  {
    path: "/Register/User",
    name: "RegisterUser", 
    component: () => import(/*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterUser"),
    meta:{hideLayout:true}
  },
];

export default routes;
