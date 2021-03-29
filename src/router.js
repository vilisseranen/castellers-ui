import Vue from "vue";
import Router from "vue-router";

import Layout from "./layout/Layout.vue";
import Login from "./views/Login.vue";
import ResetPassword from "./views/ResetPassword.vue";
import Events from "./views/Events.vue";
import Members from "./views/Members.vue";
import MemberEdit from "./views/MemberEdit.vue";
import EventEdit from "./views/EventEdit.vue";
import EventShow from "./views/EventShow.vue";
import Initialize from "./views/Initialize.vue";
import SummaryParticipation from "./views/SummaryParticipation.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  linkActiveClass: "active",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Layout,
      redirect: "/events",
      children: [
        {
          path: "initialize",
          name: "Initialize",
          component: Initialize
        },
        {
          path: "login",
          name: "Login",
          component: Login
        },
        {
          path: "reset",
          name: "Reset",
          component: ResetPassword
        },
        {
          path: "events",
          name: "Events",
          component: Events
        },
        {
          path: "members",
          name: "Members",
          component: Members,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "memberEdit",
          name: "MemberAdd",
          component: MemberEdit,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "memberEdit/:uuid",
          name: "MemberEdit",
          component: MemberEdit,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "eventEdit",
          name: "EventAdd",
          component: EventEdit,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "eventEdit/:uuid",
          name: "eventEdit",
          component: EventEdit,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "eventShow/:uuid",
          name: "eventShow",
          component: EventShow
        },
        {
          path: "summary",
          name: "summary",
          component: SummaryParticipation,
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
    /*     { path: '*', component: NotFound }
     */
  ]
});
