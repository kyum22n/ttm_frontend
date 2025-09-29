const routes = [
  {
    path: "/Auth/Login",
    component: () => import(/*webpackChunkName: "AuthRouting"*/ "@/views/Auth/Login"),
  },
  {
    path: "/Auth/FindAccount",
    component: () => import(/*webpackChunkName: "AuthRouting"*/ "@/views/Auth/FindAccount"),
  },
];

export default routes;
