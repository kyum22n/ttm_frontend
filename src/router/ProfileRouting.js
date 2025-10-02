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
    path: "/Profile/OtherProfile/:userId",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/OtherProfile"),
  },
  {
    path: "/Profile/PetEditProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/PetEditProfile"),
  },
];

export default routes;
