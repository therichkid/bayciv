import Vue from "vue";
import Router from "vue-router";

import Home from "../views/Home";
import News from "../views/News";
import Posts from "../views/Posts";
import Post from "../views/Post";
import NumbersFacts from "../views/NumbersFacts";
import Event from "../views/Event";
import SHG from "../views/SHG";
import Magazines from "../views/Magazines";
import DataControl from "../views/DataControl";
import Page from "../views/Page";
import PageNotFound from "../views/PageNotFound";

// Chunks
const Calendar = () => import(/* webpackChunkName: "calendar" */ "../views/Calendar");
const Form = () => import(/* webpackChunkName: "form" */ "../views/Form");
const SHGs = () => import(/* webpackChunkName: "map" */ "../views/SHGs");
const Facilities = () => import(/* webpackChunkName: "map" */ "../views/Facilities");

Vue.use(Router);

// TODO: use alias array for redirects after updating vue-router to v4

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
      title: "Neuigkeiten",
      description: "Neuigkeiten, aktuelle Berichte und Veranstaltungen."
    },
    alias: "/news"
  },
  // News redirects
  {
    path: "/aktuelles-lesen/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/pressespiegel/articles/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/erfahrungen/articles/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/videos/articles/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/texte/articles/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/gedichte/articles/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/news/:slug",
    name: "post",
    component: Post,
    meta: {
      title: "Neuigkeiten",
      description: "Hier geht's zum vollständigen Artikel \u201E{slug}\u201C."
    },
    props: true
  },
  {
    path: "/zahlen-fakten/page/:page?",
    name: "numbers-facts",
    component: NumbersFacts,
    meta: {
      title: "Zahlen und Fakten",
      description: "Zahlen und Fakten über das Cochlea Implantat."
    },
    alias: "/zahlen-fakten"
  },
  { path: "/anmeldungen", redirect: "/events" },
  { path: "/veranstaltungen", redirect: "/events" },
  { path: "/kalender", redirect: "/events" },
  {
    path: "/events",
    name: "events",
    component: Calendar,
    meta: {
      title: "Veranstaltungen",
      description:
        "Hier geht's zum Kalender des BayCIV's, der Auskunft über Veranstaltungen des BayCIV's und unserer SHGs gibt."
    }
  },
  {
    path: "/events/:date/:slug",
    name: "event",
    component: Event,
    meta: {
      title: "Veranstaltungen",
      description: "{slug} am {date}: Alle Infos zur Veranstaltung."
    },
    props: true
  },
  {
    path: "/events/:date/:slug/anmeldung",
    name: "Anmeldung",
    component: Form,
    meta: {
      title: "Anmeldung",
      description: "Anmeldung zur Veranstaltung {slug} am {date}."
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
      title: "Selbsthilfegruppen",
      description:
        "Der BayCIV ist Dachverband von 29 Selbsthilfegruppen in Bayern. Eine interaktive Karte verrät Kontaktinformationen der einzelnen SHGs."
    },
    props: true,
    alias: "/shgs/:groupName"
  },
  {
    path: "/magazin",
    name: "magazines",
    component: Magazines,
    meta: {
      title: "Hörgut"
    }
  },
  {
    path: "/erfahrungen/page/:page?",
    name: "posts",
    component: Posts,
    meta: {
      title: "Erfahrungen",
      description: "Erfahrungsberichte über das Leben mit einem CI."
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
      title: "Kliniken, Rehas, Beratungsstellen",
      description: "Wichtige Anlaufstellen und Kliniken."
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
  { path: "/vorstand", redirect: "/unser-team" },
  { path: "/taetigkeitsberichte", redirect: "/infos-dokumente" },
  { path: "/infomaterial", redirect: "/infos-dokumente" },
  { path: "/mitglied_werden", redirect: "/mitglied-werden" },
  {
    path: "/datenkontrolle",
    name: "datenkontrolle",
    component: DataControl,
    meta: {
      title: "Datenkontrolle",
      description: "Abmeldung vom BayCIV-Newsletter und Zurücksetzen von Cookies."
    }
  },
  {
    path: "/:slug",
    name: "page",
    component: Page,
    meta: {
      description: "Infos zu: {slug}."
    },
    props: true
  },
  { path: "*", redirect: "/404" }
];

const router = new Router({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // Give the anchor some time to load
      setTimeout(() => {
        const element = document.getElementById(to.hash.replace("#", ""));
        if (element && element.scrollIntoView) {
          element.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }, 1000);
      return { selector: to.hash };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  let title = "";
  if (to.meta.title) {
    title += `${to.meta.title} - `;
  }
  title += "BayCIV";
  document.title = title;
  let description =
    to.meta.description ||
    "Wir beraten, informieren und vertreten Ihre Interessen. Gemeinsam sind wir stark!";
  description = description.replace(/\{(.+?)\}/g, (_, param) => {
    const key = param.trim();
    if (to.params[key]) {
      return to.params[key]
        .split("-")
        .map(word => {
          word = word.replace(/ae/g, "\u00e4").replace(/oe/g, "\u00f6").replace(/ue/g, "\u00fc");
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
    return key;
  });
  document.querySelector('meta[name="description"]').setAttribute("content", description);
  document.querySelector('meta[property="og:description"]').setAttribute("content", description);
  document.querySelector('meta[itemprop="description"]').setAttribute("content", description);
  next();
});

export default router;
