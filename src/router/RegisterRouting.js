const routes = [
  {
    path: "/Register/Pet",
    name: "PetRegister",
    component: () =>
      import(
        /*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterPet"
      ),
    meta: { hideLayout: true },
  },
  {
    path: "/Register/User",
    name: "RegisterUser",
    component: () =>
      import(
        /*webpackChunkName: "RegisterRouting"*/ "@/views/Register/RegisterUser"
      ),
    meta: { hideLayout: true },
  },
  {
    path: "/Register/AddPet",
    name: "AddPet",
    component: () =>
      import(/*webpackChunkName: "RegisterRouting"*/ "@/views/Register/AddPet"),
    meta: { hideLayout: false },
  },
  {
    path: "/Register/EditPet",
    name: "EditPet",
    component: () =>
      import(
        /*webpackChunkName: "RegisterRouting"*/ "@/views/Register/EditPet"
      ),
    meta: { hideLayout: false },
  },
];

export default routes;
