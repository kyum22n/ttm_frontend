const routes = [
  {
    path: "/Profile/MyProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/MyProfile"),
  },
  {
    path: "/Profile/EditProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/EditProfile"),
  },
  {
    path: "/Profile/OtherProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/OtherProfile"),
  },
  {
    path: "/Profile/PetProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/PetProfile"),
  },
  {
    path: "/Profile/PetEditProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/PetEditProfile"),
  },
];

export default routes;
