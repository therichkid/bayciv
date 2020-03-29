<template>
  <div class="text-right">
    <span v-for="child in socialMedia" :key="child.component">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <component
              :is="child.component"
              :url="url"
              scale="2"
              v-bind="{ [child.titleProp]: title }"
              v-on="on"
            ></component>
          </v-btn>
        </template>
        <span>Per {{ child.name || child.component }} teilen</span>
      </v-tooltip>
    </span>

    <!-- Clipboard -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="copyToClipboard()">
          <v-icon class="clipboard" :color="$vuetify.theme.dark ? '#121212' : '#fff'">
            mdi-content-copy
          </v-icon>
        </v-btn>
      </template>
      <span>In die Zwischenablage kopieren</span>
    </v-tooltip>
    <v-snackbar v-model="snackbar">
      Link erfolgreich in die Zwischenablage kopiert.
      <v-btn icon dark @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { Email, Facebook, Twitter, WhatsApp } from "vue-socialmedia-share";

export default {
  components: {
    Email,
    Facebook,
    Twitter,
    WhatsApp
  },

  props: {
    link: String,
    title: String
  },

  data() {
    return {
      showLink: false,
      socialMedia: [
        {
          component: "Email",
          titleProp: "subject",
          name: "E-Mail"
        },
        {
          component: "Facebook"
        },
        {
          component: "Twitter",
          titleProp: "title"
        },
        {
          component: "WhatsApp",
          titleProp: "title"
        }
      ],
      linkPrefix: "https://www.bayciv.de",
      snackbar: false
    };
  },

  computed: {
    url() {
      return this.linkPrefix + this.link;
    }
  },

  methods: {
    copyToClipboard() {
      // copy needs a dom element
      const el = document.createElement("textarea");
      el.value = this.url;
      // Make the element invisible to the user
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      this.snackbar = true;
    }
  }
};
</script>

<style scoped>
.clipboard {
  background-color: #607d8b;
  /* color: transparent !important; */
  height: 28px !important;
  width: 28px !important;
  border-radius: 3px;
  margin-bottom: 4px;
}
</style>
