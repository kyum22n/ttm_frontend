const routes = [
  {
    path: '/User/Login',
    component: () =>(/*webpackChunkName: "UserLoginRouting"*/
    '@/views/User/Login')
  },
  {
    path: '/User/FindId',
    component: () =>(/*webpackChunkName: "UserLoginRouting"*/
    '@/views/User/FindId')
  },
  {
    path: '/User/FindPassword',
    component: () =>(/*webpackChunkName: "UserLoginRouting"*/
    '@/views/User/FindPassword')
  }
]

export default routes;