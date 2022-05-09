import { createRouter, createWebHistory } from 'vue-router'
import User from "@/views/User";
import Login from '@/views/Login';
import Layout from '@/layout/Layout';
import Register from '@/views/Register';
import Person from '@/views/Person';
const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect:'/news',
    component: Layout,
    children:[
      {
        path:'user',
        name:'User',
        component:User
      },
      {
        path:'person',
        name:'Person',
        component:Person
      },
      {
        path:'news',
        name:'News',
        component: ()=> import("@/views/News")
      },
      {
        path:'category',
        name:'Category',
        component: ()=> import("@/views/Category")
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
