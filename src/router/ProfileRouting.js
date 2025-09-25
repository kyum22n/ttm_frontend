const routes = [
  {
    path: "/Profile/My",
    component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/MyProfile"),
  },
	{
		path: "/Profile/Other",
		component: () => import(/*webpackChunkName: "ProfileRouting"*/ "@/views/Profile/OtherProfile"),
	}
];

export default routes;
