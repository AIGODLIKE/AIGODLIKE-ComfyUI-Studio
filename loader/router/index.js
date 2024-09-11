import homePage from "../pages/home/home.js";
import SettingsPage from "../pages/settings/index.js";

const routes = [
  { path: "", redirect: "/home" },
  { path: "/home", component: homePage },
  { path: "/settings", component: SettingsPage },
];
const router = window.VueRouter === undefined ? null : new VueRouter({
  mode: "hash",
  routes,
  scrollBehavior: () => ({ y: 0 }), //路由跳转后页面回到顶部
});

export default router;
