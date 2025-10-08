const routes = [
  {
    path: "/Profile/MyProfile/:userId",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/MyProfile"),
    props: true,
  },
  {
    path: "/Profile/EditProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/EditProfile"),
  },
  {
    path: "/Profile/OtherProfile/:userId",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/OtherProfile"),
    props: true
  },
  {
    path: "/Profile/PetEditProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/PetEditProfile"),
  },
];

export default routes;
