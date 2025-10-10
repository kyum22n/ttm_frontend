const routes = [
  {
    path: "/mypage/:userId",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/MyPage"),
    props: true,
  },
  {
    path: "/Profile/EditProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/EditProfile"),
  },
  {
    path: "/Profile/PetEditProfile",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/PetEditProfile"),
  },
];

export default routes;
