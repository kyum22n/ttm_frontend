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
		path: "/Post/PostDetail/:id",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostDetail"),
		props: true, 
	},
	{
		path: "/Post/PostEdit",
		component: () => import(/*webpackChunkName: "PostRouting"*/ "@/views/Post/PostEdit"),
	}
];

export default routes;
