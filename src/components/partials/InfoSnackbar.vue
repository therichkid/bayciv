<template>
  <v-snackbar
    v-model="snackbar"
    v-bind="responsiveProps"
    :timeout="0"
    color="info"
    style="z-index: 100;"
  >
    <span style="word-wrap: break-word; hyphens: auto;" v-html="info.content"></span>
    <v-tooltip bottom v-if="$vuetify.breakpoint.smAndUp">
      <template v-slot:activator="{ on }">
        <v-btn icon dark @click="snackbar = false" v-on="on">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <span>Schließen</span>
    </v-tooltip>
    <v-btn text dark @click="snackbar = false" v-else>
      Schließen
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      info: {}
    };
  },

  methods: {
    async getInfo() {
      this.info = await this.$store.dispatch("fetchPageBySlug", "info-meldung").catch(error => {
        console.error(error);
      });
      if (this.info) {
        // Remove paragraph tags that WordPress is adding automatically
        this.info.content = this.info.content.replace(/<\/?p[^>]*>/gm, "");
        setTimeout(() => {
          this.snackbar = true;
        }, 1000);
      }
    }
  },

  computed: {
    responsiveProps() {
      const props = {};
      if (this.$vuetify.breakpoint.xsOnly) {
        props.vertical = true;
      } else {
        props.multiLine = true;
      }
      if (this.$vuetify.breakpoint.smAndDown) {
        props.bottom = true;
      } else {
        props.top = true;
      }
      return props;
    }
  },

  created() {
    if (this.$vuetify.breakpoint.mdAndUp || localStorage.getItem("cookiesAccepted") === "true") {
      this.getInfo();
    } else {
      const interval = setInterval(() => {
        if (localStorage.getItem("cookiesAccepted") === "true") {
          this.getInfo();
          clearInterval(interval);
        }
      }, 1000);
    }
  }
};
</script>

<style></style>
