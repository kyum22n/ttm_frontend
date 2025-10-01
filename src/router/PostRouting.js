const routes = [
  {
    path: "/Post/MainFeed",
    component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/MainFeed"),
  },
	{
		path: "/Post/PostCreate",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostCreate"),
	},
	{
		path: "/Post/PostDetail",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostDetail"),
	}
];

export default routes;
