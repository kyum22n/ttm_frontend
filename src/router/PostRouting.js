const routes = [
  {
    path: "/Post/MainFeed",
    component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/MainFeed"),
  },
	{
		path: "/post/create",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostCreate"),
	},
	{
		path: "/post/:id",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostDetail"),
		props: true, 
	},
	{
		path: "/Post/PostEdit",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostEdit"),
	}
];

export default routes;
