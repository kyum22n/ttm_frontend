const routes = [
  {
    path: "/Walk/List",
    component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkList"),
  },
	{
		path: "/Walk/Request",
		component: () => import(/*webpackChunkName: "WalkRouting"*/ "@/views/Walk/WalkRequest"),
	}
];

export default routes;
