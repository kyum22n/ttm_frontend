const routes = [
  {
    path: "/Profile/My",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/MyProfile"),
  },
	{
    path: "/Profile/Edit",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/EditProfile"),
  },
	{
		path: "/Profile/Other",
		component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/OtherProfile"),
	}
];

export default routes;
