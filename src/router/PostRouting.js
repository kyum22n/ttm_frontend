const routes = [
  {
    path: "/Post/MainFeed",
    component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/MainFeed"),
  },
	{
		path: "/Post/Create",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostCreate"),
	},
	{
		path: "/Post/Detail",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostDetail"),
	}
];

export default routes;
