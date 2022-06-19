import PagePixiv from "@/layout/PagePixiv.vue";
import PagePicsearch from "@/layout/PagePicsearch.vue";
import PageHome from "@/layout/PageHome.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: PageHome,
  },
  {
    path: "/pixiv/:pid",
    name: "PagePixiv",
    props: true,
    component: PagePixiv,
  },
  {
    path: "/picsearch/:short",
    name: "PagePicSearch",
    props: true,
    component: PagePicsearch,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
