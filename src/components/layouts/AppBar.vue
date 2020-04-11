<template>
  <v-app-bar
    clipped-left
    app
    dark
    color="primary"
    src="@/assets/banner.png"
    v-bind="prominentBanner"
  >
    <v-app-bar-nav-icon
      @click.stop="onMenuToggleClick()"
      class="hidden-lg-and-up"
      aria-label="Menu"
    ></v-app-bar-nav-icon>

    <router-link to="/">
      <v-img class="mx-2 mt-1" src="@/assets/logo_white.png" max-height="40" max-width="40"></v-img>
    </router-link>
    <v-toolbar-title class="ml-2 hidden-xs-only">BayCIV</v-toolbar-title>

    <v-spacer></v-spacer>

    <SearchBar />

    <v-menu left bottom :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" aria-label="Settings">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <!-- Font size -->
        <v-subheader>Schriftgröße: {{ fontSize }}px</v-subheader>
        <v-list-item
          v-for="(item, i) in fontSizeMenu"
          :key="i"
          @click="onFontSizeChange(item.action)"
          :disabled="
            (i === 0 && fontSize >= 30) ||
            (i === 1 && fontSize <= 10) ||
            (i === 2 && fontSize === 16)
          "
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!-- Dark mode -->
        <v-list-item @click="toggleDarkMode()">
          <v-list-item-icon>
            <v-icon :color="toggle.color">{{ toggle.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Thema</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import SearchBar from "@/components/partials/SearchBar";

export default {
  components: {
    SearchBar
  },

  data() {
    return {
      fontSizeMenu: [
        {
          name: "Vergrößern",
          icon: "mdi-magnify-plus",
          action: +1
        },
        {
          name: "Verkleinern",
          icon: "mdi-magnify-minus",
          action: -1
        },
        {
          name: "Zurücksetzen",
          icon: "mdi-undo",
          action: null
        }
      ]
    };
  },

  computed: {
    fontSize() {
      return this.$store.state.fontSize;
    },
    toggle() {
      let icon, color;
      if (this.$vuetify.theme.dark) {
        icon = "mdi-weather-night";
        color = "#03a9f4";
      } else {
        icon = "mdi-weather-sunny";
        color = "#ffc107";
      }
      return { icon, color };
    },
    prominentBanner() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return {};
      } else {
        return {
          prominent: true,
          "shrink-on-scroll": true,
          "fade-img-on-scroll": true
        };
      }
    }
  },

  methods: {
    onMenuToggleClick() {
      this.$emit("toggleClicked");
    },
    onFontSizeChange(fontSize) {
      this.$store.commit("changeFontSize", fontSize);
    },
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.toggleDarkModeSetting();
    },
    toggleDarkModeSetting() {
      if (localStorage.getItem("darkMode") === "true") {
        localStorage.setItem("darkMode", false);
      } else {
        localStorage.setItem("darkMode", true);
      }
    }
  },

  mounted() {
    if (!localStorage.getItem("darkMode")) {
      localStorage.setItem("darkMode", false);
    }
    if (localStorage.getItem("darkMode") === "true") {
      this.$vuetify.theme.dark = true;
    }
  }
};
</script>

<style></style>
