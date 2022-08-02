import { createRouter, createWebHistory } from "vue-router";
import Layout from "../layout/Main-Layout.vue";
import Initialize from "../views/Initialize-View.vue";
import Login from "../views/Login-View.vue";
import ResetPassword from "../views/ResetPassword-View.vue";
import Events from "../views/Events-View.vue";
import Members from "../views/Members-View.vue";
import MemberEdit from "../views/MemberEdit-View.vue";
import EventEdit from "../views/EventEdit-View.vue";
import EventShow from "../views/EventShow-View.vue";
import SummaryParticipation from "../views/SummaryParticipation-View.vue";
import Castells from "../views/Castells-View.vue";
import CastellsEdit from "../views/CastellsEdit-View.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: { name: "Events" },
    children: [
      {
        path: "initialize",
        name: "Initialize",
        component: Initialize,
      },
      {
        path: "login",
        name: "Login",
        component: Login,
      },
      {
        path: "reset",
        name: "Reset",
        component: ResetPassword,
      },
      {
        path: "events",
        name: "Events",
        component: Events,
      },
      {
        path: "members",
        name: "Members",
        component: Members,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "memberEdit",
        name: "MemberAdd",
        component: MemberEdit,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "memberEdit/:uuid",
        name: "MemberEdit",
        component: MemberEdit,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "eventEdit",
        name: "EventAdd",
        component: EventEdit,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "eventEdit/:uuid",
        name: "eventEdit",
        component: EventEdit,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "eventShow/:uuid",
        name: "eventShow",
        component: EventShow,
      },
      {
        path: "summary",
        name: "Summary",
        component: SummaryParticipation,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "castells",
        name: "Castells",
        component: Castells,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "castellEdit",
        name: "CastellAdd",
        component: CastellsEdit,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "castellEdit/:uuid",
        name: "castellEdit",
        component: CastellsEdit,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "is-active",
});

export default router;
