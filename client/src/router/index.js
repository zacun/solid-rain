import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import UserInterface from "../views/UserInterface";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/ui",
    name: "UserInterface",
    component: UserInterface,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
