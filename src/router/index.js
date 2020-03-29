import Vue from "vue";
import Router from "vue-router";

import Home from "../views/Home.vue";
import Post from "../views/Post.vue";
import News from "../views/News.vue";
import Calendar from "../views/Calendar";
import Event from "../views/Event";
import Form from "../views/Form.vue";
import SHGs from "../views/SHGs";
import SHG from "../views/SHG";
import Facilities from "../views/Facilities";
import PageNotFound from "../views/PageNotFound";
import Page from "../views/Page";
import Posts from "../views/Posts";

Vue.use(Router);

// Chunking:
// () => import(/* webpackChunkName: "shgs" */ "../views/SHGs.vue")

const routes = [
  { path: "/*.html", redirect: "/*" },
  { path: "/home", redirect: "/" },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/news/page/:page",
    name: "news",
    component: News,
    meta: {
      title: "Neuigkeiten"
    }
  },
  {
    path: "/news/:slug",
    name: "post",
    component: Post,
    meta: {
      title: "Neuigkeiten"
    },
    props: true
  },
  {
    path: "/events",
    name: "events",
    component: Calendar,
    meta: {
      title: "Veranstaltungen"
    }
  },
  {
    path: "/events/:date/:slug",
    name: "event",
    component: Event,
    meta: {
      title: "Veranstaltungen"
    },
    props: true
  },
  {
    path: "/events/:date/:slug/anmeldung",
    name: "Anmeldung",
    component: Form,
    meta: {
      title: "Anmeldung"
    },
    props: route => ({
      date: route.params.date,
      slug: route.params.slug,
      type: "event"
    })
  },
  // SHG redirects
  { path: "/shg-allgaeu", redirect: "/shgs/ci-shg-allgaeu/page/1" },
  {
    path: "/shgs",
    name: "shgs",
    component: SHGs,
    meta: {
      title: "Selbsthilfegruppen"
    }
  },
  { path: "/shgs/:groupName", redirect: "/shgs/:groupName/page/1" },
  {
    path: "/shgs/:groupName/page/:page",
    name: "shg",
    component: SHG,
    meta: {
      title: "Selbsthilfegruppen"
    },
    props: true
  },
  { path: "/erfahrungen", redirect: "/erfahrungen/page/1" },
  {
    path: "/erfahrungen/page/:page",
    name: "posts",
    component: Posts,
    meta: {
      title: "Erfahrungen"
    },
    props: route => ({
      routerPage: "erfahrungen",
      page: route.params.page
    })
  },
  {
    path: "/einrichtungen",
    name: "facilities",
    component: Facilities,
    meta: {
      title: "Kliniken, Rehas, Beratungsstellen"
    }
  },
  {
    path: "/404",
    name: "404",
    component: PageNotFound,
    meta: {
      title: "404"
    }
  },
  {
    path: "/:slug",
    name: "page",
    component: Page,
    props: true
  },
  { path: "*", redirect: "/404" }
];

const router = new Router({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  let title = "";
  if (to.meta.title) {
    title += `${to.meta.title} - `;
  }
  title += "BayCIV";
  document.title = title;
  next();
});

export default router;
