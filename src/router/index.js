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

// TODO: use alias array for redirects after updating vue-router to v4

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
  { path: "/bayciv", redirect: "/news" },
  { path: "/aktuelle-meldungen", redirect: "/news" },
  { path: "/aktuelle-meldungen-gruppen", redirect: "/news" },
  {
    path: "/news/page/:page?",
    name: "news",
    component: News,
    meta: {
      title: "Neuigkeiten"
    },
    alias: "/news"
  },
  // News redirects
  {
    path: "/aktuelles-lesen/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/pressespiegel/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/erfahrungen/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/videos/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/texte/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/gedichte/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
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
  { path: "/anmeldungen", redirect: "/events" },
  { path: "/veranstaltungen", redirect: "/events" },
  { path: "/kalender", redirect: "/events" },
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
  { path: "/selbsthilfe", redirect: "/shgs" },
  {
    path: "/shgs",
    name: "shgs",
    component: SHGs,
    meta: {
      title: "Selbsthilfegruppen"
    }
  },
  // SHG redirects
  { path: "/shg-allgaeu", redirect: "/shgs/ci-shg-allgaeu" },
  {
    path: "/shgs/:groupName/page/:page?",
    name: "shg",
    component: SHG,
    meta: {
      title: "Selbsthilfegruppen"
    },
    props: true,
    alias: "/shgs/:groupName"
  },
  {
    path: "/erfahrungen/page/:page?",
    name: "posts",
    component: Posts,
    meta: {
      title: "Erfahrungen"
    },
    props: route => ({
      routerPage: "erfahrungen",
      page: route.params.page
    }),
    alias: "/erfahrungen"
  },
  { path: "/kliniken", redirect: "/einrichtungen" },
  { path: "/rehabilation", redirect: "/einrichtungen" },
  { path: "/beratungsstellen", redirect: "/einrichtungen" },
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
  // Page redirects
  { path: "/cochlea", redirect: "/was-ist-ein-ci" },
  { path: "/implantate", redirect: "/ci-systeme" },
  { path: "/ziele", redirect: "/verband" },
  { path: "/taetigkeitsberichte", redirect: "/infos-dokumente" },
  { path: "/infomaterial", redirect: "/infos-dokumente" },
  { path: "/mitglied_werden", redirect: "/mitglied-werden" },
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
