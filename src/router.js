import Vue from 'vue'
import Router from 'vue-router'

import Layout from './layout/Layout.vue'
import Login from './views/Login.vue'
import Temp from './views/Temp.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/login',
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'temp',
          name: 'Temp',
          component: Temp
        }/* ,
        {
          path: 'initialize',
          name: 'Initialize',
          component: Initialize
        },
        {
          path: 'members',
          name: 'Members',
          component: Members
        },
        {
          path: 'memberEdit',
          name: 'MemberAdd',
          component: MemberEdit
        },
        {
          path: 'memberEdit/:uuid',
          name: 'MemberEdit',
          component: MemberEdit
        },
        {
          path: 'practices',
          name: 'Practices',
          component: Practices
        },
        {
          path: 'practiceEdit',
          name: 'PracticeAdd',
          component: PracticeEdit
        },
        {
          path: 'practiceEdit/:uuid',
          name: 'practiceEdit',
          component: PracticeEdit
        },
        {
          path: 'events',
          name: 'Events',
          component: Events
        } */
      ]
    }
    /*     { path: '*', component: NotFound }
 */ ]
})
