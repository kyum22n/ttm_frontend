const routes = [
  {
    path: "/Auth/Login",
    component: () => import(/*webpackChunkName: "AuthRouting"*/ "@/views/Auth/Login"),
    meta: { hideLayout: true }
  },
  {
    path: "/Auth/FindAccount",
    component: () => import(/*webpackChunkName: "AuthRouting"*/ "@/views/Auth/FindAccount"),
    meta: { hideLayout: true }
  },
];

export default routes;
