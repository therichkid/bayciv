<template>
  <v-app>
    <NavigationDrawer ref="drawer" />

    <AppBar @toggleClicked="onToggleEmit()" />

    <v-main>
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
      <Footer />
    </v-main>

    <FAB />

    <CookieAlert />
  </v-app>
</template>

<script>
import AppBar from "@/components/layouts/AppBar";
import Footer from "@/components/layouts/Footer";
import NavigationDrawer from "@/components/layouts/NavigationDrawer";
import CookieAlert from "@/components/partials/CookieAlert";
import FAB from "@/components/partials/FAB";

export default {
  components: { NavigationDrawer, AppBar, Footer, FAB, CookieAlert },

  methods: {
    onToggleEmit() {
      this.$refs.drawer.drawer = !this.$refs.drawer.drawer;
    }
  },

  mounted() {
    // Workaround to disable ripple effect on touchmove
    window.addEventListener(
      "touchmove",
      () => {
        document.body.classList.add("hide-ripple");
      },
      { passive: true }
    );
    window.addEventListener("touchend", () => {
      setTimeout(() => {
        document.body.classList.remove("hide-ripple");
      }, 50);
    });
  }
};
</script>

<style>
.main-container {
  max-width: 1200px;
  min-height: 60vh;
}
.post-container {
  max-width: 800px;
  line-height: 1.8;
  word-wrap: break-word;
  hyphens: auto;
}
.post-container p {
  text-align: justify;
}
.event-card {
  width: 100%;
  min-width: 225px;
  max-width: 275px;
}
.v-card__title {
  word-break: break-word;
}
.v-banner__wrapper {
  border-bottom: none !important;
}
.hide-ripple .v-ripple__container {
  display: none;
}
/* WP classes */
/* Inherited via v-html so they need a global style to be attached */
[class*="wp-image"],
.wp-caption {
  height: auto;
  max-width: 100%;
}
.wp-caption-text {
  font-size: smaller;
  font-style: italic;
}
.alignleft {
  float: left;
  margin: 0 10px 0 0;
  max-width: 100%;
}
.aligncenter {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
.alignright {
  float: right;
  margin: 0 0 0 10px;
  max-width: 100%;
}
.alignnone {
  margin: 0;
  max-width: 100%;
}
@media screen and (max-width: 599px) {
  .alignright,
  .alignleft {
    float: none;
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
}
iframe {
  max-width: 100%;
}
table.tablepress {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
table.tablepress tr > th {
  color: #fff;
  background-color: var(--v-primary-base);
}
table.tablepress > *:first-child > tr:first-child > th,
table.tablepress > *:first-child > tr:first-child > td {
  border-top: 1px solid #7a7a7a;
}
table.tablepress tr > th,
table.tablepress tr > td {
  border-bottom: 1px solid #7a7a7a;
  padding: 5px 10px;
}
table.tablepress tr > th:first-child,
table.tablepress tr > td:first-child {
  border-left: 1px solid #7a7a7a;
}
table.tablepress tr > th:last-child,
table.tablepress tr > td:last-child {
  border-right: 1px solid #7a7a7a;
}
table.tablepress > *:first-child > tr:first-child > th:first-child,
table.tablepress > *:first-child > tr:first-child > td:first-child {
  border-top-left-radius: 10px;
}
table.tablepress > *:first-child > tr:first-child > th:last-child,
table.tablepress > *:first-child > tr:first-child > td:last-child {
  border-top-right-radius: 10px;
}
table.tablepress tr:last-child > td:first-child {
  border-bottom-left-radius: 10px;
}
table.tablepress tr:last-child > td:last-child {
  border-bottom-right-radius: 10px;
}
.bayciv-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
}
.bayciv-grid > img,
.bayciv-grid > div {
  margin: 0;
  padding: 0 5px;
}
@media screen and (min-width: 750px) {
  .bayciv-grid > img,
  .bayciv-grid > div {
    flex-basis: 33%;
  }
}
@media screen and (max-width: 749px) {
  .bayciv-grid > img,
  .bayciv-grid > div {
    flex-basis: 50%;
  }
}
/* Remove certain areas when printing the document */
@media print {
  nav,
  header,
  footer,
  body.no-img img,
  body.no-img iframe,
  body.no-img .v-image,
  .v-btn--fab,
  .v-menu__content,
  .v-tooltip__content {
    display: none !important;
  }
  body:not(.no-img) .v-image {
    visibility: visible;
    print-color-adjust: exact;
  }
  main {
    padding: 0 !important;
  }
}
/* Style the youtube wrapper */
.yt-wrapper {
  position: relative;
  display: inline-block;
}
.yt-wrapper > img {
  width: 480px;
  height: auto;
  max-width: 100%;
}
.yt-wrapper > svg {
  width: 68px;
  height: 48px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: grayscale(1);
  opacity: 0.75;
}
.yt-wrapper:hover > svg {
  filter: grayscale(0);
  opacity: 1;
}
</style>
