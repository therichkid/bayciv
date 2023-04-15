<template>
  <v-card v-if="info" dark :color="info.type" class="mb-4">
    <v-card-title :class="info.link && 'pb-0'">
      <v-icon v-if="info.type === 'success' && $vuetify.breakpoint.smAndUp" class="mr-4">
        mdi-check-circle
      </v-icon>
      <v-icon v-if="info.type === 'info' && $vuetify.breakpoint.smAndUp" class="mr-4">
        mdi-information
      </v-icon>
      <h3
        :class="info.teaser && info.teaser.length < 100 ? 'headline' : 'subtitle-1'"
        style="flex: 1; word-wrap: break-word; hyphens: auto; text-align: justify"
      >
        {{ info.teaser }}
      </h3>
    </v-card-title>
    <v-card-actions v-if="info.buttons.length">
      <v-spacer></v-spacer>
      <v-btn text v-for="button of info.buttons" :key="button.link" v-bind="button.linkProps">
        {{ button.text || "Mehr Infos" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      info: null
    };
  },

  methods: {
    async getInfo() {
      this.info = await this.$store.dispatch("fetchPageBySlug", "info-meldung").catch(error => {
        console.error(error);
      });
      if (!this.info) {
        return;
      }
      this.info.buttons.forEach(button => {
        if (button.link.match(/http|www/i)) {
          // External link
          button.linkProps = {
            href: button.link.includes("http") ? button.link : `https://${button.link}`,
            target: "_blank",
            rel: "noopener noreferrer"
          };
        } else {
          // Internal link
          button.linkProps = { to: button.link };
        }
      });
      const content = this.shared.stripHtml(this.info.content);
      if (content) {
        // Add a link to itself to show as a page
        this.info.buttons.push({ linkProps: { to: this.info.slug } });
      }
    }
  },

  created() {
    this.getInfo();
  }
};
</script>

<style></style>
