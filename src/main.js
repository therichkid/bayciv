import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import VueGtag from "vue-gtag";
import vuetify from "./plugins/vuetify";
import router from "./router/index";
import shared from "./services/shared";
import store from "./store/index";

Vue.prototype.shared = shared;

// Google Tag Manager
Vue.use(
  VueGtag,
  {
    config: { id: "G-T5CJWYPB23" },
    enabled: false
  },
  router
);

// vue2-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
