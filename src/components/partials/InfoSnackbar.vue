<template>
  <v-snackbar
    v-model="snackbar"
    bottom
    :multi-line="$vuetify.breakpoint.smAndUp"
    :vertical="$vuetify.breakpoint.xsOnly"
    :timeout="0"
    color="info"
    style="z-index: 100;"
  >
    <span style="word-wrap: break-word; hyphens: auto;" v-html="info.content"></span>
    <v-btn icon dark @click="snackbar = false" v-if="$vuetify.breakpoint.smAndUp">
      <v-icon>mdi-close</v-icon>
    </v-btn>
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
        this.snackbar = true;
      }
    }
  },

  created() {
    this.getInfo();
  }
};
</script>

<style></style>
