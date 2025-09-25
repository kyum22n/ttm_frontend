const routes = [
  {
    path: "/Message/List",
    component: () => import(/*webpackChunkName: "MessageRouting"*/ "@/views/Message/MessageList"),
  },
  {
    path: "/Message/Detail",
    component: () => import(/*webpackChunkName: "MessageRouting"*/ "@/views/Message/MessageDetail"),
  },
];

export default routes;
