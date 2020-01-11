import Vue from 'vue'
import Router from 'vue-router'

import Layout from './layout/Layout.vue'
import Login from './views/Login.vue'
import Events from './views/Events.vue'
import Members from './views/Members.vue'
import MemberEdit from './views/MemberEdit.vue'
import EventEdit from './views/EventEdit.vue'
import Initialize from './views/Initialize.vue'

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
          path: 'initialize',
          name: 'Initialize',
          component: Initialize
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'events',
          name: 'Events',
          component: Events
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
          path: 'eventEdit',
          name: 'EventAdd',
          component: EventEdit
        },
        {
          path: 'eventEdit/:uuid',
          name: 'eventEdit',
          component: EventEdit
        }
      ]
    }
    /*     { path: '*', component: NotFound }
 */ ]
})
